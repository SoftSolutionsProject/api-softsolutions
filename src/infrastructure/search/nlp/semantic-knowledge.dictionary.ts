export interface SemanticKnowledgeEntry {
  synonyms: string[];
  concepts: string[];
  boostTerms: string[];
  exclusions?: string[];
  category: string;
}

export const AMBIGUOUS_TERMS: Record<string, string[]> = {
  java: ['javascript'],
  javascript: ['java'],
  react: ['reactive'],
  sql: ['nosql'],
};

export const SEMANTIC_KNOWLEDGE: Record<string, SemanticKnowledgeEntry> = {
  backend: {
    synonyms: ['api', 'servidor', 'rest', 'node', 'nestjs'],
    concepts: ['desenvolvimento backend'],
    boostTerms: ['backend', 'api'],
    category: 'backend',
  },
  frontend: {
    synonyms: ['ui', 'interface', 'web', 'react', 'javascript'],
    concepts: ['frontend web'],
    boostTerms: ['frontend', 'web'],
    category: 'frontend',
  },
  java: {
    synonyms: ['spring', 'spring boot'],
    concepts: ['backend java'],
    boostTerms: ['java', 'spring'],
    exclusions: ['javascript'],
    category: 'backend',
  },
  javascript: {
    synonyms: ['js', 'typescript'],
    concepts: ['frontend javascript'],
    boostTerms: ['javascript', 'frontend'],
    exclusions: ['java'],
    category: 'frontend',
  },
  react: {
    synonyms: ['reactjs', 'jsx', 'react native'],
    concepts: ['frontend react', 'mobile'],
    boostTerms: ['react', 'reactjs', 'react native'],
    category: 'frontend',
  },
  node: {
    synonyms: ['nodejs', 'nestjs', 'express'],
    concepts: ['backend node'],
    boostTerms: ['node', 'nestjs'],
    category: 'backend',
  },
  python: {
    synonyms: ['django', 'flask', 'fastapi'],
    concepts: ['backend python', 'programacao python'],
    boostTerms: ['python'],
    category: 'backend',
  },
  sql: {
    synonyms: ['postgresql', 'mysql', 'banco de dados'],
    concepts: ['database', 'banco de dados'],
    boostTerms: ['sql', 'database'],
    category: 'database',
  },
  docker: {
    synonyms: ['container', 'compose'],
    concepts: ['infraestrutura', 'devops'],
    boostTerms: ['docker', 'devops'],
    category: 'devops',
  },
  curso: {
    synonyms: ['treinamento', 'aprendizado'],
    concepts: ['educacao'],
    boostTerms: ['curso', 'aula'],
    category: 'education',
  },
  certificado: {
    synonyms: ['diploma', 'comprovante'],
    concepts: ['emissao'],
    boostTerms: ['certificado'],
    category: 'support',
  },
  login: {
    synonyms: ['acesso', 'senha', 'entrar'],
    concepts: ['usuario'],
    boostTerms: ['login', 'senha'],
    category: 'support',
  },
  ia: {
    synonyms: ['inteligencia artificial', 'machine learning', 'ai'],
    concepts: ['aprendizado de maquina'],
    boostTerms: ['ia', 'python', 'dados'],
    category: 'ia',
  },
};

