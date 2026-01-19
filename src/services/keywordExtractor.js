import nlp from 'compromise';

/**
 * Extract key entities and concepts from article title
 * Returns: { people: [], objects: [], locations: [], keywords: [] }
 */
export function extractKeywords(title) {
  const doc = nlp(title);
  
  // Extract people names
  const people = doc.people().out('array');
  
  // Extract places/locations
  const locations = doc.places().out('array');
  
  // Extract nouns as potential objects/concepts
  const nouns = doc.nouns().out('array')
    .filter(noun => noun.length > 2) // Filter out very short words
    .filter(noun => !people.includes(noun)) // Remove people from objects
    .filter(noun => !locations.includes(noun)); // Remove locations from objects
  
  // Extract important terms (capitalized words, proper nouns)
  const terms = doc.terms().out('array');
  const capitalizedTerms = terms.filter(term => 
    term.length > 2 && /^[A-Z]/.test(term) && 
    !people.includes(term) && 
    !locations.includes(term)
  );

  // Combine and deduplicate
  const objects = [...new Set([...nouns, ...capitalizedTerms])].slice(0, 5);
  
  // Generate search keywords for different image categories
  const keywords = {
    people: people.slice(0, 2), // Top 2 people
    objects: objects.slice(0, 3), // Top 3 objects/concepts
    locations: locations.slice(0, 2), // Top 2 locations
    general: extractGeneralKeywords(title) // Fallback keywords
  };

  console.log('🔍 Extracted keywords:', keywords);
  return keywords;
}

/**
 * Extract general keywords for fallback searches
 */
function extractGeneralKeywords(title) {
  const doc = nlp(title);
  
  // Get most important words (excluding common stop words)
  const important = doc.terms()
    .not('#Preposition')
    .not('#Conjunction')
    .not('#Article')
    .out('array')
    .filter(word => word.length > 3)
    .slice(0, 5);

  return important;
}

/**
 * Determine the best search strategy based on extracted keywords
 */
export function getSearchStrategy(keywords) {
  const strategy = {
    mainSubject: null,
    secondarySubject: null,
    background: null
  };

  // Priority: People > Objects > Locations > General
  if (keywords.people.length > 0) {
    strategy.mainSubject = {
      type: 'person',
      query: keywords.people[0]
    };
  } else if (keywords.objects.length > 0) {
    strategy.mainSubject = {
      type: 'object',
      query: keywords.objects[0]
    };
  } else if (keywords.general.length > 0) {
    strategy.mainSubject = {
      type: 'general',
      query: keywords.general[0]
    };
  }

  // Secondary subject
  if (keywords.objects.length > 1) {
    strategy.secondarySubject = {
      type: 'object',
      query: keywords.objects[1]
    };
  } else if (keywords.objects.length === 1 && keywords.people.length > 0) {
    strategy.secondarySubject = {
      type: 'object',
      query: keywords.objects[0]
    };
  }

  // Background
  if (keywords.locations.length > 0) {
    strategy.background = {
      type: 'location',
      query: keywords.locations[0]
    };
  } else if (keywords.general.length > 1) {
    strategy.background = {
      type: 'general',
      query: keywords.general[1]
    };
  }

  console.log('🎯 Search strategy:', strategy);
  return strategy;
}

