require('dotenv').config();

const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const { scrapeFOA } = require('./agents/foaScraper');
const { parseProposal } = require('./agents/proposalParser');
const { checkCompliance } = require('./agents/complianceChecker');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }
});

app.post('/api/upload', upload.fields([
  { name: 'foaDocument', maxCount: 1 },
  { name: 'grantPackages', maxCount: 20 }
]), async (req, res) => {
  try {
    console.log('\n' + '='.repeat(60));
    console.log('🚀 COMPLIANCE CHECK REQUEST RECEIVED');
    console.log('='.repeat(60));
    
    const foaDocument = req.files['foaDocument'] ? req.files['foaDocument'][0] : null;
    const grantPackages = req.files['grantPackages'] || [];
    const foaUrl = req.body.foaUrl || null;

    console.log('\n📥 Uploaded Files:');
    console.log('   FOA Document:', foaDocument ? foaDocument.originalname : 'None (using URL)');
    console.log('   FOA URL:', foaUrl || 'None');
    console.log('   Grant Packages:', grantPackages.length, 'files');
    
    grantPackages.forEach((file, index) => {
      console.log(`      ${index + 1}. ${file.originalname} (${(file.size / 1024).toFixed(2)} KB)`);
    });

    const foaNumber = extractFOANumber(foaUrl);
    console.log('\n📋 Extracted FOA Number:', foaNumber || 'Could not extract');

    console.log('\n' + '-'.repeat(60));
    console.log('🤖 STARTING AI AGENT SWARM (Parallel Processing)');
    console.log('-'.repeat(60));

    const [foaResults, proposalResults] = await Promise.all([
      scrapeFOA(foaNumber, foaDocument?.path),
      parseProposal(grantPackages.map(f => f.path))
    ]);

    console.log('\n' + '-'.repeat(60));
    console.log('🔄 AGENT 1 & 2 COMPLETE - Starting Agent 3');
    console.log('-'.repeat(60));

    const complianceReport = await checkCompliance(foaResults, proposalResults);

    console.log('\n' + '='.repeat(60));
    console.log('✅ COMPLIANCE CHECK COMPLETE');
    console.log('='.repeat(60));

    const response = {
      success: true,
      message: 'Compliance check completed',
      data: {
        foaDocument: foaDocument ? {
          filename: foaDocument.filename,
          originalName: foaDocument.originalname,
          size: foaDocument.size
        } : null,
        foaUrl: foaUrl,
        foaNumber: foaNumber,
        grantPackages: grantPackages.map(file => ({
          filename: file.filename,
          originalName: file.originalname,
          size: file.size
        })),
        agentResults: {
          foaScraper: {
            success: foaResults.success,
            requirementsFound: foaResults.requirements?.requiredDocuments?.length || 0
          },
          proposalParser: {
            success: proposalResults.success,
            sectionsFound: proposalResults.sections?.length || 0,
            totalPages: proposalResults.totalPages
          }
        },
        complianceReport: complianceReport
      }
    };

    res.json(response);
  } catch (error) {
    console.error('\n❌ Compliance Check Error:', error);
    res.status(500).json({
      success: false,
      message: 'Compliance check failed',
      error: error.message
    });
  }
});

function extractFOANumber(input) {
  if (!input) return null;
  
  const patterns = [
    /PA-\d{2}-\d{3}/i,
    /PAR-\d{2}-\d{3}/i,
    /RFA-\w{2}-\d{2}-\d{3}/i,
    /NOT-\w{2}-\d{2}-\d{3}/i,
    /R01|R21|R03|K01|K08|K23|F31|F32|T32/i
  ];

  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match) return match[0].toUpperCase();
  }

  return input;
}

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`\n🚀 GrantMax Backend Server`);
  console.log(`📡 Server running on http://localhost:${PORT}`);
  console.log(`📁 Upload directory: ${uploadDir}\n`);
});
