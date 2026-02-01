const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const OpenAI = require('openai');

async function parseProposal(filePaths) {
  console.log('\n📄 [AGENT 2] Proposal Parser Starting...');
  console.log(`   Input: ${filePaths.length} file(s)`);

  try {
    const reductoApiKey = process.env.REDUCTO_API_KEY;
    const openaiApiKey = process.env.OPENAI_API_KEY;
    
    if (!reductoApiKey) {
      throw new Error('REDUCTO_API_KEY not found in environment');
    }
    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY not found in environment');
    }

    const openai = new OpenAI({ apiKey: openaiApiKey });
    let allContent = '';
    let totalPages = 0;
    let allBlocks = [];

    for (const filePath of filePaths) {
      console.log(`   Processing: ${path.basename(filePath)}`);
      const fileResult = await parseWithReducto(filePath, reductoApiKey);
      
      if (fileResult.success) {
        allContent += `\n\n=== FILE: ${path.basename(filePath)} ===\n${fileResult.text}`;
        totalPages += fileResult.pageCount || 0;
        allBlocks = allBlocks.concat(fileResult.blocks || []);
      }
    }

    console.log(`   Reducto extracted ${totalPages} pages, ${allContent.length} characters`);
    console.log(`   Analyzing content with OpenAI...`);

    const analysis = await analyzeWithOpenAI(openai, allContent, allBlocks, totalPages);

    console.log('   ✅ Proposal parsing completed');
    console.log(`   Total pages: ${totalPages}`);
    console.log(`   Documents found: ${analysis.document_inventory?.found_documents?.length || 0}`);

    return {
      success: true,
      totalPages,
      ...analysis
    };

  } catch (error) {
    console.error('   ❌ Proposal Parser Error:', error.message);
    return {
      success: false,
      error: error.message,
      totalPages: 0
    };
  }
}

async function analyzeWithOpenAI(openai, content, blocks, totalPages) {
  const contentSample = content.length > 50000 ? content.substring(0, 50000) + '\n...[truncated]' : content;
  
  const prompt = `You are an expert NIH grant proposal analyzer. Analyze this grant proposal content extracted from a PDF and return a detailed JSON analysis.

PROPOSAL CONTENT (${totalPages} pages):
${contentSample}

Return a JSON object with this EXACT structure:
{
  "proposal_metadata": {
    "title": "extracted proposal title",
    "pi_name": "Principal Investigator name",
    "pi_institution": "institution name",
    "extraction_timestamp": "${new Date().toISOString()}"
  },
  "document_inventory": {
    "found_documents": [
      {
        "name": "document name (e.g., Specific Aims, Research Strategy, Budget, Biosketch, etc.)",
        "status": "present",
        "pages": estimated_page_count,
        "compliant": true/false,
        "notes": "any relevant notes"
      }
    ],
    "missing_documents": [
      {
        "name": "missing document name",
        "severity": "critical/warning",
        "note": "why it appears to be missing"
      }
    ]
  },
  "page_limit_compliance": {
    "specific_aims": { "found": pages, "allowed": 1, "status": "compliant/exceeded" },
    "research_strategy": { "found": pages, "allowed": 12, "status": "compliant/exceeded" },
    "biosketches": { "found": pages, "allowed": 5, "status": "compliant/exceeded" },
    "data_management_plan": { "found": pages, "allowed": 2, "status": "compliant/exceeded" }
  },
  "content_mapping": {
    "specific_aims": { "present": true/false, "page_estimate": "1" },
    "significance": { "present": true/false, "page_estimate": "2-4" },
    "innovation": { "present": true/false, "page_estimate": "5-6" },
    "approach": { "present": true/false, "page_estimate": "7-12" },
    "preliminary_data": { "present": true/false },
    "timeline": { "present": true/false },
    "rigor_section": { "present": true/false }
  },
  "collaboration_detection": {
    "collaborators_mentioned": [
      {
        "name": "collaborator name",
        "institution": "institution",
        "role": "role description",
        "letter_of_support": "FOUND/NOT FOUND"
      }
    ]
  },
  "budget_analysis": {
    "type": "Modular/Detailed/R&R",
    "budget_detected": true/false,
    "budget_justification_detected": true/false,
    "extracted_totals": {
      "direct_costs_year1": null,
      "total_project": null
    }
  },
  "human_subjects_vertebrate_animals": {
    "human_subjects": { "involved": true/false, "irb_mentioned": true/false },
    "vertebrate_animals": { "involved": true/false, "iacuc_mentioned": true/false }
  },
  "formatting_analysis": {
    "estimated_font": "Arial/Times New Roman/Unknown",
    "appears_compliant": true/false,
    "notes": "any formatting observations"
  },
  "sections": [
    { "name": "section name", "detected": true, "page_estimate": "1-2" }
  ]
}

Be thorough. Look for ALL standard NIH grant components. Return ONLY valid JSON.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are an expert NIH grant proposal analyzer. Return only valid JSON.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.2,
      max_tokens: 4000
    });

    const responseText = response.choices[0].message.content;
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return { error: 'Could not parse OpenAI response', raw: responseText };
  } catch (error) {
    console.log(`   OpenAI analysis error: ${error.message}`);
    return { error: error.message };
  }
}

async function parseWithReducto(filePath, apiKey) {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);

    console.log(`   Uploading to Reducto...`);
    const formData = new FormData();
    formData.append('file', fileBuffer, {
      filename: fileName,
      contentType: 'application/pdf'
    });

    const uploadResponse = await axios.post(
      'https://platform.reducto.ai/upload',
      formData,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          ...formData.getHeaders()
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      }
    );

    const reductoUrl = uploadResponse.data.file_id;
    console.log(`   File uploaded, parsing with file_id: ${reductoUrl}`);

    const parseResponse = await axios.post(
      'https://platform.reducto.ai/parse',
      {
        input: reductoUrl
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const data = parseResponse.data;
    const chunks = data.result?.chunks || [];
    const pageCount = data.usage?.num_pages || estimatePageCount(fileBuffer.length);
    
    const allText = chunks.map(chunk => chunk.content || '').join('\n\n');
    const allBlocks = chunks.flatMap(chunk => chunk.blocks || []);
    
    return {
      success: true,
      pageCount: pageCount,
      text: allText,
      blocks: allBlocks,
      sections: extractSectionsFromBlocks(allBlocks, allText),
      metadata: { jobId: data.job_id, duration: data.duration }
    };

  } catch (error) {
    console.log(`   Reducto API error for ${path.basename(filePath)}: ${error.message}`);
    
    return await fallbackParsing(filePath);
  }
}

function extractSectionsFromBlocks(blocks, fullText) {
  const sections = [];
  const textLower = fullText.toLowerCase();
  
  const sectionPatterns = [
    { name: 'Specific Aims', patterns: ['specific aims', 'specific aim'] },
    { name: 'Research Strategy', patterns: ['research strategy', 'significance', 'innovation', 'approach'] },
    { name: 'Budget', patterns: ['budget', 'detailed budget', 'modular budget'] },
    { name: 'Biosketch', patterns: ['biosketch', 'biographical sketch', 'education/training'] },
    { name: 'Abstract', patterns: ['abstract', 'project summary', 'summary/abstract'] },
    { name: 'Facilities', patterns: ['facilities', 'other resources', 'equipment'] },
    { name: 'References', patterns: ['references cited', 'bibliography', 'literature cited'] },
    { name: 'Data Management Plan', patterns: ['data management', 'sharing plan', 'data sharing'] },
    { name: 'Human Subjects', patterns: ['human subjects', 'protection of human'] },
    { name: 'Vertebrate Animals', patterns: ['vertebrate animals'] },
    { name: 'Authentication', patterns: ['authentication of key', 'key biological'] },
    { name: 'Letters of Support', patterns: ['letter of support', 'letters of support', 'collaboration'] }
  ];

  for (const { name, patterns } of sectionPatterns) {
    for (const pattern of patterns) {
      if (textLower.includes(pattern)) {
        if (!sections.find(s => s.name === name)) {
          sections.push({ name, detected: true, confidence: 'high' });
        }
        break;
      }
    }
  }

  for (const block of blocks) {
    if (block.type === 'Header' && block.content) {
      const headerLower = block.content.toLowerCase();
      for (const { name, patterns } of sectionPatterns) {
        if (patterns.some(p => headerLower.includes(p))) {
          if (!sections.find(s => s.name === name)) {
            sections.push({ name, detected: true, confidence: 'high', fromHeader: true });
          }
        }
      }
    }
  }

  return sections;
}

async function fallbackParsing(filePath) {
  const stats = fs.statSync(filePath);
  const fileSizeKB = stats.size / 1024;
  const estimatedPages = Math.ceil(fileSizeKB / 50);
  
  const fileName = path.basename(filePath).toLowerCase();
  const detectedSections = [];
  
  if (fileName.includes('aim') || fileName.includes('specific')) {
    detectedSections.push({ name: 'Specific Aims', detected: true });
  }
  if (fileName.includes('research') || fileName.includes('strategy')) {
    detectedSections.push({ name: 'Research Strategy', detected: true });
  }
  if (fileName.includes('budget')) {
    detectedSections.push({ name: 'Budget', detected: true });
  }
  if (fileName.includes('bio') || fileName.includes('sketch')) {
    detectedSections.push({ name: 'Biosketch', detected: true });
  }
  if (fileName.includes('abstract') || fileName.includes('summary')) {
    detectedSections.push({ name: 'Abstract', detected: true });
  }
  if (fileName.includes('facility') || fileName.includes('resource')) {
    detectedSections.push({ name: 'Facilities', detected: true });
  }
  if (fileName.includes('letter') || fileName.includes('support')) {
    detectedSections.push({ name: 'Letters of Support', detected: true });
  }
  if (fileName.includes('data') && fileName.includes('management')) {
    detectedSections.push({ name: 'Data Management Plan', detected: true });
  }

  return {
    success: true,
    pageCount: estimatedPages,
    text: `[Content from ${path.basename(filePath)}]`,
    sections: detectedSections,
    metadata: { estimatedFromFileSize: true },
    note: 'Parsed using fallback method'
  };
}

function estimatePageCount(fileSizeBytes) {
  return Math.max(1, Math.ceil(fileSizeBytes / (50 * 1024)));
}

module.exports = { parseProposal };
