'use client';

import { useState, useEffect } from 'react';

export default function GridContainer({ 
  gridItems, 
  difficultyLevels, 
  styles, 
  setIsBothSelected, 
  onLongRectangleClick, 
  inputText, 
  selectedGridItem, 
  setSelectedGridItem, 
  selectedDifficulty, 
  setSelectedDifficulty, 
  showGridWarning, 
  setShowGridWarning,
  isBothSelected,
  longRectangleKey
}) {
  const [isInitialRender, setIsInitialRender] = useState(true);

  useEffect(() => {
    setIsInitialRender(false);
  }, []);

  useEffect(() => {
    const bothSelected = selectedGridItem !== null && selectedDifficulty !== null;
    setIsBothSelected(bothSelected && inputText);
    if (bothSelected && inputText) {
      setShowGridWarning(false);
    }
  }, [selectedGridItem, selectedDifficulty, inputText, setIsBothSelected, setShowGridWarning]);

  const handleGridItemClick = (index) => {
    if (!inputText) {
      onLongRectangleClick();
      return;
    }
    setSelectedGridItem(selectedGridItem === index ? null : index);
  };

  const handleDifficultyClick = (index) => {
    if (!inputText) {
      onLongRectangleClick();
      return;
    }
    setSelectedDifficulty(selectedDifficulty === index ? null : index);
  };

  const getLongRectangleText = () => {
    const emptyBracket = '[\u00A0\u00A0\u00A0\u00A0\u00A0]';
    const typeText = selectedGridItem !== null ? `[${gridItems[selectedGridItem]}]` : emptyBracket;
    const difficultyText = selectedDifficulty !== null ? `[${difficultyLevels[selectedDifficulty]}]` : emptyBracket;
    return `${typeText} 유형의 ${difficultyText} 난이도로 문제 출제하기`;
  };

  return (
    <div className={styles.gridContainer}>
      <p className={styles.gridText}>
        2단계 : 변형할 유형과 난이도를 골라봐요
        {showGridWarning && <span className={`${styles.warningDot} ${styles.blinkAnimation}`}>•</span>}
      </p>
      <p className={styles.subText}>문제 유형</p>
      <div className={styles.gridWrapper}>
        {gridItems.map((item, index) => (
          <div 
            key={index} 
            className={`${styles.smallRectangle} ${selectedGridItem === index ? styles.clicked : ''}`}
            onClick={() => handleGridItemClick(index)}
          >
            {item}
          </div>
        ))}
      </div>
      <p className={styles.subText}><br/><br/>난이도</p>
      <div className={styles.difficultyWrapper}>
        {difficultyLevels.map((level, index) => (
          <div 
            key={index} 
            className={`${styles.smallRectangle} ${selectedDifficulty === index ? styles.clicked : ''}`}
            onClick={() => handleDifficultyClick(index)}
          >
            {level}
          </div>
        ))}
      </div>
      <p className={styles.stepThreeText}>3단계 : 생성해 봐요</p>
      <div 
        key={longRectangleKey}
        className={`${styles.longRectangle} ${isBothSelected ? styles.gradientBackground : ''} ${styles.fadeInOut}`}
        onClick={onLongRectangleClick}
      >
        <span 
          className={`${styles.longRectangleText} ${isBothSelected ? styles.whiteText : ''}`}
        >
          {getLongRectangleText()}
        </span>
      </div>
    </div>
  );
}