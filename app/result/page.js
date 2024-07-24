'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import styles from "../page.module.css";

function convertMarkdownToHtml(markdown) {
  let html = markdown;
  // Convert headers
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  // Convert bold text
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  return html;
}

function ResultContent() {
  const [title, setTitle] = useState('문제를 출제중이에요...');
  const [showPills, setShowPills] = useState(false);
  const [showText, setShowText] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [titleKey, setTitleKey] = useState(0);
  const [resultText, setResultText] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const input = searchParams.get('input');
    if (input) {
      const decodedInput = decodeURIComponent(input);
      
      // API 호출 및 결과 처리
      const fetchResult = async () => {
        try {
          setShowPills(true);
          
          const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ input: decodedInput }),
          });
          
          if (!response.ok) {
            throw new Error('Failed to generate content');
          }
          
          const data = await response.json();
          const htmlText = convertMarkdownToHtml(data.result);
          setResultText(htmlText);
          
          // 결과를 받아온 후 UI 업데이트
          setTimeout(() => {
            setShowText(true);
            setTitleKey(prev => prev + 1);
            setTitle('문제 출제를 완료했어요!');
            setTimeout(() => {
              setShowButton(true);
            }, 500);
          }, 2000); // API 응답 후 2초 뒤에 결과 표시
        } catch (error) {
          console.error('Error:', error);
          setTitle('문제 출제 중 오류가 발생했습니다.');
        }
      };

      fetchResult();
    }
  }, [searchParams]);

  const getPillWidth = (index) => {
    if (index < 2) return '25%';
    if (index === 2) return '40%';
    return '80%';
  };

  const handleButtonClick = () => {
    router.push('/');
  };

  return (
    <div className={styles.wideScreenWrapper}>
      <div className={styles.pageContainer}>
        <main className={styles.main}>
          <h1 key={titleKey} className={`${styles.title} ${styles.fadeInOut}`}>{title}</h1>
          <div className={styles.resultRectangleWrapper}>
            <div className={`${styles.rectangle} ${styles.resultRectangle}`}>
              {!showText ? (
                <div className={styles.pillContainer}>
                  {[...Array(8)].map((_, index) => (
                    <div 
                      key={index} 
                      className={`${styles.pill} ${showPills ? styles.show : ''}`} 
                      style={{
                        animationDelay: `${index * 0.15}s`,
                        width: getPillWidth(index)
                      }}
                    ></div>
                  ))}
                </div>
              ) : (
                <div className={`${styles.geminiResultText} ${styles.fadeInAnimation}`}>
                  <div dangerouslySetInnerHTML={{ __html: resultText }} />
                </div>
              )}
            </div>
            {showButton && (
              <div className={`${styles.resultButtonWrapper} ${styles.fadeInAnimation}`}>
                <button className={styles.resultButton} onClick={handleButtonClick}>
                  <span className={styles.resultButtonText}>다른 문제 출제하기</span>
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function Result() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResultContent />
    </Suspense>
  );
}