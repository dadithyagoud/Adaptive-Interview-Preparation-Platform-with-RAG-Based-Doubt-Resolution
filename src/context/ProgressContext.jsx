import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { companies } from '../mockData/companies';

const ProgressContext = createContext();

export const ProgressProvider = ({ children }) => {
  // Levels: 'beginner', 'intermediate', 'advanced', or null
  const [levels, setLevels] = useState(() => {
    const saved = localStorage.getItem('mockLevels');
    return saved ? JSON.parse(saved) : { os: null, dbms: null, cn: null, oops: null };
  });

  const [completedTopics, setCompletedTopics] = useState(() => {
    const saved = localStorage.getItem('mockCompletedTopics');
    return saved ? JSON.parse(saved) : {};
  });

  const [selectedCompanyType, setSelectedCompanyType] = useState(() => {
    return localStorage.getItem('mockCompanyType') || 'product'; // Default to product-based track
  });

  const [weakTopicIds, setWeakTopicIds] = useState(() => {
    const saved = localStorage.getItem('mockWeakTopicIds');
    return saved ? JSON.parse(saved) : { os: [] };
  });

  const [assessmentHistory, setAssessmentHistory] = useState(() => {
    const saved = localStorage.getItem('mockAssessmentHistory');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        // ignore parse error
      }
    }
    // Default initial mock history entry
    return [
      {
        id: 'hist-init-1',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        subjectId: 'os',
        subjectName: 'Operating Systems',
        topicId: null,
        topicTitle: 'Operating Systems Diagnostic Assessment (15 Qs)',
        isTopicTest: false,
        score: 11,
        totalQuestions: 15,
        percentage: 73,
        passed: true,
        diagnosedLevel: 'intermediate',
        weakCount: 4
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('mockLevels', JSON.stringify(levels));
  }, [levels]);

  useEffect(() => {
    localStorage.setItem('mockCompletedTopics', JSON.stringify(completedTopics));
  }, [completedTopics]);

  useEffect(() => {
    localStorage.setItem('mockWeakTopicIds', JSON.stringify(weakTopicIds));
  }, [weakTopicIds]);

  useEffect(() => {
    localStorage.setItem('mockAssessmentHistory', JSON.stringify(assessmentHistory));
  }, [assessmentHistory]);

  useEffect(() => {
    if (selectedCompanyType) {
      localStorage.setItem('mockCompanyType', selectedCompanyType);
    }
  }, [selectedCompanyType]);

  const updateLevel = (subjectId, level) => {
    setLevels(prev => ({ ...prev, [subjectId]: level }));
  };

  const setSubjectWeakTopics = (subjectId, topicIds) => {
    setWeakTopicIds(prev => ({
      ...prev,
      [subjectId]: Array.from(new Set(topicIds || []))
    }));
  };

  const removeWeakTopic = (subjectId, topicId) => {
    setWeakTopicIds(prev => ({
      ...prev,
      [subjectId]: (prev[subjectId] || []).filter(id => id !== topicId)
    }));
  };

  const toggleTopic = (topicId) => {
    setCompletedTopics(prev => {
      const isCompleted = prev[topicId];
      if (isCompleted) {
        const newState = { ...prev };
        delete newState[topicId];
        return newState;
      } else {
        removeWeakTopic('os', topicId);
        return { ...prev, [topicId]: true };
      }
    });
  };

  // Company details
  const companyDetails = useMemo(() => {
    return companies.find(c => c.id === selectedCompanyType) || companies[0];
  }, [selectedCompanyType]);

  // Helper: check if a subject has High, Medium, or Low emphasis for the active company
  const getSubjectEmphasis = (subjectId) => {
    if (!companyDetails || !companyDetails.emphasis) return 'Medium';
    return companyDetails.emphasis[subjectId] || 'Medium';
  };

  // Helper: check if a topic is flagged as high priority for the target company
  const isTopicCompanyPriority = (topicId) => {
    if (!companyDetails || !companyDetails.priorityTopicIds) return false;
    return companyDetails.priorityTopicIds.includes(topicId);
  };

  // Calculate overall readiness score (0-100%)
  const overallReadiness = useMemo(() => {
    const weights = { beginner: 35, intermediate: 70, advanced: 100 };
    const assessedSubjects = Object.entries(levels).filter(([_, lvl]) => lvl !== null);
    if (assessedSubjects.length === 0) return 0;

    let totalScore = 0;
    assessedSubjects.forEach(([subj, lvl]) => {
      const base = weights[lvl] || 0;
      // If company has high emphasis on this subject, weight it higher in readiness calculation
      const emphasis = companyDetails?.emphasis?.[subj] || 'Medium';
      const multiplier = emphasis === 'High' ? 1.2 : emphasis === 'Medium' ? 1.0 : 0.8;
      totalScore += base * multiplier;
    });

    const maxScore = assessedSubjects.length * 100 * 1.2;
    const levelPercentage = Math.round((totalScore / maxScore) * 80); // Up to 80% from assessments

    // Up to 20% bonus from completed topics
    const topicCount = Object.keys(completedTopics).length;
    const topicBonus = Math.min(topicCount * 2, 20);

    return Math.min(levelPercentage + topicBonus, 100);
  }, [levels, completedTopics, companyDetails]);

  const addAssessmentResult = (record) => {
    setAssessmentHistory(prev => [
      {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        ...record
      },
      ...prev
    ].slice(0, 50));
  };

  const resetProgress = () => {
    setLevels({ os: null, dbms: null, cn: null, oops: null });
    setCompletedTopics({});
    setWeakTopicIds({ os: [] });
    setAssessmentHistory([]);
    localStorage.removeItem('mockLevels');
    localStorage.removeItem('mockCompletedTopics');
    localStorage.removeItem('mockWeakTopicIds');
    localStorage.removeItem('mockAssessmentHistory');
  };

  return (
    <ProgressContext.Provider value={{ 
      levels, 
      updateLevel, 
      completedTopics, 
      toggleTopic,
      weakTopicIds,
      setSubjectWeakTopics,
      removeWeakTopic,
      assessmentHistory,
      addAssessmentResult,
      resetProgress,
      selectedCompanyType, 
      setSelectedCompanyType,
      companyDetails,
      getSubjectEmphasis,
      isTopicCompanyPriority,
      overallReadiness
    }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => useContext(ProgressContext);
