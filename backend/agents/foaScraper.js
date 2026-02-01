const axios = require('axios');

async function scrapeFOA(foaNumber, foaFilePath = null) {
  console.log('\n🔍 [AGENT 1] FOA Scraper Starting...');
  console.log(`   Input: ${foaNumber || 'PDF file'}`);

  try {
    let foaUrl = null;
    
    if (foaNumber) {
      foaUrl = `https://grants.nih.gov/grants/guide/pa-files/${foaNumber}.html`;
    }

    if (!foaUrl && !foaFilePath) {
      throw new Error('No FOA number or file provided');
    }

    const firecrawlApiKey = process.env.FIRECRAWL_API_KEY;
    if (!firecrawlApiKey) {
      throw new Error('FIRECRAWL_API_KEY not found in environment');
    }

    console.log(`   Scraping URL: ${foaUrl}`);

    const response = await axios.post(
      'https://api.firecrawl.dev/v1/scrape',
      {
        url: foaUrl,
        formats: ['markdown', 'html'],
        onlyMainContent: true
      },
      {
        headers: {
          'Authorization': `Bearer ${firecrawlApiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const scrapedContent = response.data.data?.markdown || response.data.data?.html || '';
    
    const requirements = extractRequirements(scrapedContent, foaNumber);

    console.log('   ✅ FOA requirements extracted successfully');
    console.log(`   Found ${requirements.requiredDocuments.length} required documents`);
    
    return {
      success: true,
      foaNumber: foaNumber,
      foaUrl: foaUrl,
      requirements: requirements,
      rawContent: scrapedContent.substring(0, 5000)
    };

  } catch (error) {
    console.error('   ❌ FOA Scraper Error:', error.message);
    return {
      success: false,
      error: error.message,
      foaNumber: foaNumber,
      requirements: getDefaultRequirements(foaNumber)
    };
  }
}

function extractRequirements(content, foaNumber) {
  const requirements = {
    foaNumber: foaNumber,
    foaType: detectFOAType(foaNumber),
    requiredDocuments: [],
    pageLimits: {},
    formattingRules: {},
    budgetRules: {},
    eligibility: [],
    deadlines: {},
    specialRequirements: []
  };

  requirements.requiredDocuments = [
    { name: 'Specific Aims', required: true, maxPages: 1 },
    { name: 'Research Strategy', required: true, maxPages: 12 },
    { name: 'Bibliography & References Cited', required: true, maxPages: null },
    { name: 'Budget and Budget Justification', required: true, maxPages: null },
    { name: 'Facilities & Other Resources', required: true, maxPages: null },
    { name: 'Equipment', required: true, maxPages: null },
    { name: 'Biographical Sketch (Biosketch)', required: true, maxPages: 5 },
    { name: 'Project Summary/Abstract', required: true, maxPages: 1 },
    { name: 'Project Narrative', required: true, maxPages: null },
    { name: 'Authentication of Key Biological Resources', required: false, maxPages: 1 },
    { name: 'Letters of Support', required: false, maxPages: null },
    { name: 'Resource Sharing Plan', required: false, maxPages: null },
    { name: 'Data Management and Sharing Plan', required: true, maxPages: 2 }
  ];

  if (foaNumber && foaNumber.includes('R01')) {
    requirements.pageLimits = {
      specificAims: 1,
      researchStrategy: 12,
      biosketch: 5,
      abstract: 30,
      dataManagementPlan: 2
    };
  }

  requirements.formattingRules = {
    font: 'Arial, Georgia, Helvetica, or Palatino Linotype',
    fontSize: '11 points or larger',
    margins: '0.5 inch minimum',
    lineSpacing: 'Single-spaced',
    paperSize: '8.5 x 11 inches',
    headerFooter: 'Must include page numbers'
  };

  requirements.budgetRules = {
    directCostsLimit: foaNumber?.includes('R01') ? 500000 : null,
    modularBudget: true,
    modulesOf: 25000,
    maxModules: 10,
    requiresDetailedBudget: false,
    indirectCosts: 'As negotiated with institution'
  };

  if (content) {
    const pageMatch = content.match(/(\d+)\s*page[s]?\s*(?:limit|maximum)/gi);
    if (pageMatch) {
      requirements.specialRequirements.push(`Page limits found in FOA: ${pageMatch.join(', ')}`);
    }

    const deadlineMatch = content.match(/deadline[s]?[:\s]+([A-Za-z]+\s+\d{1,2},?\s+\d{4})/gi);
    if (deadlineMatch) {
      requirements.deadlines.found = deadlineMatch;
    }
  }

  return requirements;
}

function detectFOAType(foaNumber) {
  if (!foaNumber) return 'Unknown';
  if (foaNumber.includes('R01')) return 'Research Project Grant (R01)';
  if (foaNumber.includes('R21')) return 'Exploratory/Developmental Grant (R21)';
  if (foaNumber.includes('R03')) return 'Small Grant (R03)';
  if (foaNumber.includes('K')) return 'Career Development Award';
  if (foaNumber.includes('F')) return 'Fellowship';
  if (foaNumber.includes('T')) return 'Training Grant';
  if (foaNumber.includes('P')) return 'Program Project/Center';
  return 'Research Grant';
}

function getDefaultRequirements(foaNumber) {
  return {
    foaNumber: foaNumber,
    foaType: detectFOAType(foaNumber),
    requiredDocuments: [
      { name: 'Specific Aims', required: true, maxPages: 1 },
      { name: 'Research Strategy', required: true, maxPages: 12 },
      { name: 'Budget', required: true, maxPages: null },
      { name: 'Biosketch', required: true, maxPages: 5 },
      { name: 'Abstract', required: true, maxPages: 1 }
    ],
    pageLimits: { specificAims: 1, researchStrategy: 12 },
    formattingRules: { font: 'Arial 11pt', margins: '0.5 inch' },
    budgetRules: {},
    note: 'Using default NIH requirements - FOA scraping failed'
  };
}

module.exports = { scrapeFOA };
