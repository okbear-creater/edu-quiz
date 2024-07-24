'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from "./page.module.css";
import GridContainer from './GridContainer';

const gridItems = [
  "목적", "심경 변화", "주장", "의미하는 바",
  "요지", "주제", "제목", "내용일치",
  "어법", "어휘", "짧은 빈칸", "긴 빈칸",
  "무관한 문장", "순서배열", "문장 삽입", "요약문 완성"
];

const difficultyLevels = ["0점 방지", "보통", "준킬러", "킬러"];

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [titleKey, setTitleKey] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [showGridWarning, setShowGridWarning] = useState(false);
  const [isBothSelected, setIsBothSelected] = useState(false);
  const [shakeTitle, setShakeTitle] = useState(false);
  const [suppressFade, setSuppressFade] = useState(false);
  const [selectedGridItem, setSelectedGridItem] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [longRectangleKey, setLongRectangleKey] = useState(0);
  const isInitialRender = useRef(true);
  const router = useRouter();

  const handleTextInput = (e) => {
    setInputText(e.target.value);
    if (e.target.value && !inputText) {
      setTitleKey(prev => prev + 1);
      setSuppressFade(false);
    } else if (!e.target.value && inputText) {
      setTitleKey(prev => prev + 1);
      setSuppressFade(false);
      setSelectedGridItem(null);
      setSelectedDifficulty(null);
    }
    setShowWarning(false);
    setShowGridWarning(false);
    setShakeTitle(false);
  };

  const handleLongRectangleClick = () => {
    if (!inputText) {
      setShowWarning(true);
      setShakeTitle(true);
      setSuppressFade(true);
      setTimeout(() => {
        setShakeTitle(false);
      }, 400);
    } else if (!isBothSelected) {
      setShowGridWarning(true);
      setShakeTitle(true);
      setSuppressFade(true);
      setTimeout(() => {
        setShakeTitle(false);
      }, 400);
    } else {
      const number = selectedGridItem + 1;
      const level = ['easy', 'normal', 'hard', 'super hard'][selectedDifficulty];
      const newINPUT_IS_THIS = `number : ${number}, level : ${level}, paragraph : ${inputText}`;
      
      // URL 매개변수로 정보를 전달
      const encodedInput = encodeURIComponent(newINPUT_IS_THIS);
      router.push(`/result?input=${encodedInput}`);
    }
  };

  const getTitle = () => {
    if (!inputText) return '안녕하세요 선생님, 출제할 지문을 붙여넣어요';
    if (isBothSelected) return '다했어요 아래 버튼을 눌러서 문제를 출제해 봐요';
    return '오른쪽에서 변형할 문제 유형과 난이도를 골라봐요';
  };

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    if (!suppressFade) {
      setTitleKey(prev => prev + 1);
    }
  }, [isBothSelected, suppressFade]);

  useEffect(() => {
    if (isBothSelected) {
      setShowGridWarning(false);
    }
    setLongRectangleKey(prev => prev + 1);
  }, [isBothSelected, selectedGridItem, selectedDifficulty]);

  return (
    <div className={styles.wideScreenWrapper}>
      <div className={styles.pageContainer}>
        <main className={styles.main}>
          <h1 
            key={titleKey} 
            className={`${styles.title} ${!isInitialRender.current && !suppressFade ? styles.fadeInOut : ''} ${shakeTitle ? styles.shakeAnimation : ''}`}
          >
            {getTitle()}
          </h1>
          <div className={styles.container}>
            <div className={styles.rectangle}>
              <p className={styles.rectangleText}>
                1단계 : 출제할 지문을 붙여넣어요
                {showWarning && <span className={`${styles.warningDot} ${styles.blinkAnimation}`}>•</span>}
              </p>
              <textarea 
                className={styles.textInput} 
                placeholder="여기에 붙여넣기"
                value={inputText}
                onChange={handleTextInput}
              ></textarea>
            </div>
            <GridContainer 
              gridItems={gridItems} 
              difficultyLevels={difficultyLevels} 
              styles={styles} 
              setIsBothSelected={setIsBothSelected}
              onLongRectangleClick={handleLongRectangleClick}
              inputText={inputText}
              selectedGridItem={selectedGridItem}
              setSelectedGridItem={setSelectedGridItem}
              selectedDifficulty={selectedDifficulty}
              setSelectedDifficulty={setSelectedDifficulty}
              showGridWarning={showGridWarning}
              setShowGridWarning={setShowGridWarning}
              isBothSelected={isBothSelected}
              longRectangleKey={longRectangleKey}
            />
          </div>
        </main>
      </div>
    </div>
  );
}