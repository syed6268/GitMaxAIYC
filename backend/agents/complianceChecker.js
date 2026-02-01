const OpenAI = require('openai');

async function checkCompliance(foaRequirements, proposalAnalysis) {
  console.log('\n⚖️  [AGENT 3] Compliance Checker Starting...');
  
  try {
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY not found in environment');
    }

    const openai = new OpenAI({ apiKey: openaiApiKey });

    const ruleBasedResults = performRuleBasedCheck(foaRequirements, proposalAnalysis);

    const aiAnalysis = await performAIAnalysis(openai, foaRequirements, proposalAnalysis, ruleBasedResults);

    const report = generateComplianceReport(ruleBasedResults, aiAnalysis, proposalAnalysis);

    console.log('   ✅ Compliance check completed');
    console.log(`   Overall Score: ${report.overallScore}%`);
    console.log(`   Critical Errors: ${report.criticalErrors.length}`);
    console.log(`   Warnings: ${report.warnings.length}`);

    return report;

  } catch (error) {
    console.error('   ❌ Compliance Checker Error:', error.message);
    return generateFallbackReport(foaRequirements, proposalAnalysis, error.message);
  }
}

function performRuleBasedCheck(foaRequirements, proposalAnalysis) {
  const results = {
    documentChecks: [],
    pageLimitChecks: [],
    formattingChecks: [],
    missingDocuments: [],
    passedChecks: [],
    collaborationIssues: []
  };

  const foundDocs = proposalAnalysis.document_inventory?.found_documents || [];
  const missingDocs = proposalAnalysis.document_inventory?.missing_documents || [];
  const pageLimits = proposalAnalysis.page_limit_compliance || {};
  const collaborators = proposalAnalysis.collaboration_detection?.collaborators_mentioned || [];

  for (const doc of foundDocs) {
    results.documentChecks.push({
      document: doc.name,
      status: 'found',
      pages: doc.pages,
      compliant: doc.compliant,
      notes: doc.notes
    });
    
    if (doc.compliant === true) {
      results.passedChecks.push({
        check: `${doc.name}`,
        detail: doc.pages ? `${doc.pages} pages` : 'Present'
      });
    }
  }

  for (const doc of missingDocs) {
    results.missingDocuments.push({
      document: doc.name,
      severity: doc.severity,
      note: doc.note
    });
  }

  for (const [section, limits] of Object.entries(pageLimits)) {
    if (limits.status === 'exceeded') {
      results.pageLimitChecks.push({
        document: section,
        status: 'exceeded',
        actual: limits.found,
        limit: limits.allowed
      });
    } else if (limits.status === 'compliant') {
      results.passedChecks.push({
        check: `${section} page limit`,
        detail: `${limits.found}/${limits.allowed} pages`
      });
    }
  }

  for (const collab of collaborators) {
    if (collab.letter_of_support === 'NOT FOUND') {
      results.collaborationIssues.push({
        collaborator: collab.name,
        institution: collab.institution,
        issue: 'Missing Letter of Support',
        severity: 'critical'
      });
    }
  }

  if (proposalAnalysis.formatting_analysis?.appears_compliant) {
    results.passedChecks.push({
      check: 'Formatting',
      detail: proposalAnalysis.formatting_analysis.notes || 'Appears compliant'
    });
  }

  return results;
}

async function performAIAnalysis(openai, foaRequirements, proposalAnalysis, ruleBasedResults) {
  const foundDocs = proposalAnalysis.document_inventory?.found_documents?.map(d => d.name) || [];
  const missingDocs = ruleBasedResults.missingDocuments.map(d => d.document);
  const collabIssues = ruleBasedResults.collaborationIssues.map(c => `${c.collaborator} (${c.institution}): ${c.issue}`);
  
  const prompt = `You are a grant compliance expert. Analyze this grant proposal against FOA requirements.

FOA REQUIREMENTS (from ${foaRequirements.foaNumber || 'Unknown FOA'}):
${JSON.stringify(foaRequirements.requirements, null, 2)}

PROPOSAL ANALYSIS:
- Title: ${proposalAnalysis.proposal_metadata?.title || 'Unknown'}
- PI: ${proposalAnalysis.proposal_metadata?.pi_name || 'Unknown'}
- Institution: ${proposalAnalysis.proposal_metadata?.pi_institution || 'Unknown'}
- Total pages: ${proposalAnalysis.totalPages || 'Unknown'}
- Documents found: ${foundDocs.join(', ') || 'None identified'}
- Missing documents: ${missingDocs.join(', ') || 'None'}
- Collaboration issues: ${collabIssues.join('; ') || 'None'}
- Page limit compliance: ${JSON.stringify(proposalAnalysis.page_limit_compliance || {})}
- Content mapping: ${JSON.stringify(proposalAnalysis.content_mapping || {})}
- Budget analysis: ${JSON.stringify(proposalAnalysis.budget_analysis || {})}
- Human subjects/Animals: ${JSON.stringify(proposalAnalysis.human_subjects_vertebrate_animals || {})}

Provide a JSON response with:
{
  "additionalIssues": ["list any additional compliance issues not caught by rules"],
  "recommendations": ["list specific, actionable recommendations to fix issues"],
  "riskAssessment": "low/medium/high",
  "submissionReadiness": "ready/needs_work/not_ready",
  "summary": "2-3 sentence overall assessment"
}`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a grant compliance expert. Respond only with valid JSON.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 1000
    });

    const content = response.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return { summary: content };
  } catch (error) {
    console.log('   AI analysis fallback:', error.message);
    return {
      additionalIssues: [],
      recommendations: ['Review all documents manually before submission'],
      riskAssessment: 'medium',
      submissionReadiness: 'needs_work',
      summary: 'AI analysis unavailable - please review manually'
    };
  }
}

function generateComplianceReport(ruleBasedResults, aiAnalysis, proposalAnalysis) {
  const criticalErrors = [];
  const warnings = [];
  const passed = [];

  for (const missing of ruleBasedResults.missingDocuments) {
    criticalErrors.push({
      type: 'missing_document',
      message: `Missing required document: ${missing.document}`,
      severity: missing.severity || 'critical',
      note: missing.note,
      action: `Add ${missing.document} to your application`
    });
  }

  for (const pageCheck of ruleBasedResults.pageLimitChecks) {
    if (pageCheck.status === 'exceeded') {
      criticalErrors.push({
        type: 'page_limit_exceeded',
        message: `${pageCheck.document} exceeds page limit (${pageCheck.actual}/${pageCheck.limit} pages)`,
        severity: 'critical',
        action: `Reduce ${pageCheck.document} to ${pageCheck.limit} pages or fewer`
      });
    }
  }

  for (const collab of ruleBasedResults.collaborationIssues || []) {
    criticalErrors.push({
      type: 'missing_letter_of_support',
      message: `Missing Letter of Support from ${collab.collaborator} at ${collab.institution}`,
      severity: 'critical',
      action: `Obtain signed letter from ${collab.institution} Sponsored Programs`
    });
  }

  for (const check of ruleBasedResults.documentChecks) {
    if (check.status === 'found') {
      passed.push({
        type: 'document_present',
        message: `${check.document} is present`,
        detail: check.pages ? `${check.pages} pages` : 'Present',
        compliant: check.compliant
      });
    }
  }

  for (const passedCheck of ruleBasedResults.passedChecks) {
    passed.push({
      type: 'check_passed',
      message: passedCheck.check,
      detail: passedCheck.detail
    });
  }

  if (aiAnalysis.additionalIssues) {
    for (const issue of aiAnalysis.additionalIssues) {
      if (issue && issue.trim()) {
        warnings.push({
          type: 'ai_detected',
          message: issue,
          severity: 'warning'
        });
      }
    }
  }

  const totalChecks = criticalErrors.length + warnings.length + passed.length;
  const overallScore = totalChecks > 0 
    ? Math.round((passed.length / totalChecks) * 100)
    : 0;

  let readyToSubmit = 'No';
  if (criticalErrors.length === 0 && warnings.length <= 2) {
    readyToSubmit = 'Yes';
  } else if (criticalErrors.length === 0) {
    readyToSubmit = 'Yes (with minor fixes recommended)';
  }

  return {
    overallScore,
    readyToSubmit,
    proposalMetadata: proposalAnalysis?.proposal_metadata || null,
    criticalErrors,
    warnings,
    passed,
    recommendations: aiAnalysis.recommendations || [],
    riskAssessment: aiAnalysis.riskAssessment || 'medium',
    submissionReadiness: aiAnalysis.submissionReadiness || 'needs_work',
    summary: aiAnalysis.summary || 'Review completed',
    totalDocumentsFound: ruleBasedResults.documentChecks.length,
    totalDocumentsRequired: ruleBasedResults.documentChecks.length + ruleBasedResults.missingDocuments.length
  };
}

function generateFallbackReport(foaRequirements, proposalAnalysis, errorMessage) {
  return {
    overallScore: 0,
    readyToSubmit: 'Unable to determine',
    criticalErrors: [{
      type: 'system_error',
      message: `Compliance check failed: ${errorMessage}`,
      severity: 'critical',
      action: 'Please try again or review manually'
    }],
    warnings: [],
    passed: [],
    recommendations: ['Manual review required due to system error'],
    riskAssessment: 'unknown',
    summary: 'Compliance check could not be completed',
    error: errorMessage
  };
}

module.exports = { checkCompliance };
