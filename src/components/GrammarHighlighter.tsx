'use client';

import React, { useState, useEffect } from 'react';
import nlp from 'compromise';

// Define types for our highlighted elements
interface HighlightedElement {
  word: string;
  type: string;
  color: string;
}

// compromiseのTermオブジェクト用の型定義
interface CompromiseTerm {
  text: () => string;
  has: (tag: string) => boolean;
}

export default function GrammarHighlighter() {
  const [text, setText] = useState<string>('');
  const [highlightedElements, setHighlightedElements] = useState<HighlightedElement[]>([]);
  const [debug, setDebug] = useState<string>('');
  
  // コンポーネントがマウントされたときにサンプルテキストを解析
  useEffect(() => {
    const sampleText = "I'm a student. You're very kind.";
    setText(sampleText);
    try {
      const results = analyzeGrammar(sampleText);
      setHighlightedElements(results);
      setDebug(`解析成功: ${results.length}個の単語を解析しました`);
    } catch (error) {
      setDebug(`エラー発生: ${error instanceof Error ? error.message : String(error)}`);
    }
  }, []);
  
  const analyzeGrammar = (inputText: string): HighlightedElement[] => {
    if (!inputText) return [];
    
    try {
      // 結果を格納する配列
      const results: HighlightedElement[] = [];
      
      // compromiseライブラリを使用して品詞解析
      const doc = nlp(inputText);
      
      // 各単語を処理
      doc.terms().forEach((term: CompromiseTerm) => {
        // 単語のテキストを取得
        const word = term.text();
        
        // 単語の品詞を判定
        if (term.has('#Determiner') || term.has('#Article')) {
          results.push({ word, type: 'article', color: '#CC7700' }); // 冠詞
        }
        else if (term.has('#Pronoun')) {
          results.push({ word, type: 'pronoun', color: '#4B0082' }); // 代名詞
        }
        else if (term.has('#Conjunction')) {
          results.push({ word, type: 'conjunction', color: '#8B4513' }); // 接続詞
        }
        else if (term.has('#Preposition')) {
          results.push({ word, type: 'preposition', color: '#006400' }); // 前置詞
        }
        else if (term.has('#Auxiliary') || term.has('#Modal')) {
          results.push({ word, type: 'auxiliary', color: '#800080' }); // 助動詞
        }
        else if (term.has('#Verb')) {
          results.push({ word, type: 'verb', color: '#0000CD' }); // 動詞
        }
        else if (term.has('#Adjective')) {
          results.push({ word, type: 'adjective', color: '#228B22' }); // 形容詞
        }
        else if (term.has('#Adverb')) {
          results.push({ word, type: 'adverb', color: '#008B8B' }); // 副詞
        }
        else if (term.has('#Noun')) {
          results.push({ word, type: 'noun', color: '#990000' }); // 名詞
        }
        else if (term.has('#Punctuation')) {
          results.push({ word, type: 'punctuation', color: '#555555' }); // 句読点
        }
        else if (term.has('#Contraction')) {
          results.push({ word, type: 'contraction', color: '#800080' }); // 短縮形
        }
        // その他の場合
        else {
          results.push({ word, type: 'other', color: '#888888' }); // その他
        }
      });
      
      console.log('解析結果:', results); // デバッグ用
      return results;
    } catch (error) {
      console.error('解析エラー:', error);
      setDebug(`解析エラー: ${error instanceof Error ? error.message : String(error)}`);
      return [];
    }
  };
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    try {
      const results = analyzeGrammar(newText);
      setHighlightedElements(results);
      setDebug(`解析成功: ${results.length}個の単語を解析しました`);
    } catch (error) {
      setDebug(`エラー発生: ${error instanceof Error ? error.message : String(error)}`);
    }
  };
  
  // 品詞の日本語表記を取得する関数
  const getJapaneseType = (type: string): string => {
    switch (type) {
      case 'article': return '冠詞';
      case 'pronoun': return '代名詞';
      case 'conjunction': return '接続詞';
      case 'preposition': return '前置詞';
      case 'auxiliary': return '助動詞';
      case 'contraction': return '短縮形';
      case 'verb': return '動詞';
      case 'adjective': return '形容詞';
      case 'adverb': return '副詞';
      case 'noun': return '名詞';
      case 'punctuation': return '句読点';
      case 'other': return 'その他';
      default: return type;
    }
  };
  
  return (
    <div className="p-6 max-w-4xl mx-auto bg-white">
      <h1 className="text-2xl font-bold mb-4 text-gray-900">英語文法ハイライター</h1>
      <p className="mb-4 text-gray-800">英語の文章を入力すると、品詞ごとに色分けして表示します。</p>
      
      <textarea
        className="w-full p-4 border border-gray-300 rounded-md mb-4 bg-white text-lg text-gray-900"
        rows={6}
        placeholder="英文を入力してください（例：I'm a student. You're very kind.）"
        value={text}
        onChange={handleTextChange}
      />
      
      {debug && (
        <div className="mb-4 p-2 bg-gray-100 text-sm rounded">
          <p>デバッグ情報: {debug}</p>
        </div>
      )}
      
      <div className="p-4 border border-gray-300 rounded-md mb-6 min-h-[8rem] bg-white">
        {highlightedElements.length > 0 ? (
          <div className="flex flex-wrap gap-4 text-lg">
            {highlightedElements.map((element, index) => (
              <div key={index} className="flex flex-col items-center mb-2">
                <span
                  style={{ color: element.color }}
                  className="font-semibold"
                >
                  {element.word}
                </span>
                <span className="text-xs mt-1 text-gray-700 bg-gray-100 px-1 py-0.5 rounded">
                  {getJapaneseType(element.type)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">ここに色分けされた文章が表示されます</p>
        )}
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-white p-4 rounded-md border border-gray-300 text-base text-gray-800">
        <div className="flex items-center">
          <span className="w-4 h-4 inline-block mr-2" style={{ backgroundColor: '#CC7700' }}></span>
          <span>冠詞</span>
        </div>
        <div className="flex items-center">
          <span className="w-4 h-4 inline-block mr-2" style={{ backgroundColor: '#4B0082' }}></span>
          <span>代名詞</span>
        </div>
        <div className="flex items-center">
          <span className="w-4 h-4 inline-block mr-2" style={{ backgroundColor: '#8B4513' }}></span>
          <span>接続詞</span>
        </div>
        <div className="flex items-center">
          <span className="w-4 h-4 inline-block mr-2" style={{ backgroundColor: '#006400' }}></span>
          <span>前置詞</span>
        </div>
        <div className="flex items-center">
          <span className="w-4 h-4 inline-block mr-2" style={{ backgroundColor: '#800080' }}></span>
          <span>助動詞/短縮形</span>
        </div>
        <div className="flex items-center">
          <span className="w-4 h-4 inline-block mr-2" style={{ backgroundColor: '#0000CD' }}></span>
          <span>動詞</span>
        </div>
        <div className="flex items-center">
          <span className="w-4 h-4 inline-block mr-2" style={{ backgroundColor: '#228B22' }}></span>
          <span>形容詞</span>
        </div>
        <div className="flex items-center">
          <span className="w-4 h-4 inline-block mr-2" style={{ backgroundColor: '#008B8B' }}></span>
          <span>副詞</span>
        </div>
        <div className="flex items-center">
          <span className="w-4 h-4 inline-block mr-2" style={{ backgroundColor: '#990000' }}></span>
          <span>名詞</span>
        </div>
        <div className="flex items-center">
          <span className="w-4 h-4 inline-block mr-2" style={{ backgroundColor: '#555555' }}></span>
          <span>句読点</span>
        </div>
        <div className="flex items-center">
          <span className="w-4 h-4 inline-block mr-2" style={{ backgroundColor: '#888888' }}></span>
          <span>その他</span>
        </div>
      </div>
    </div>
  );
} 