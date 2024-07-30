// LearningModule.js
import React, { useState } from 'react';

function LearningModule() {
  const [step, setStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);

  const lessons = [
    { 
      title: 'Introduction to ASL', 
      content: 'This is an introduction to American Sign Language (ASL).',
      quiz: {
        question: 'What does ASL stand for?',
        options: ['American Sign Language', 'Australian Sign Language', 'African Sign Language'],
        answer: 'American Sign Language'
      }
    },
    { 
      title: 'Basic Signs', 
      content: 'Learn the basic signs in ASL such as "Hello", "Thank you", and "Please".',
      quiz: {
        question: 'What is the sign for "Hello"?',
        options: ['Waving hand', 'Thumbs up', 'Shaking head'],
        answer: 'Waving hand'
      }
    },
    { 
      title: 'Medical Terms', 
      content: 'Learn important medical terms in ASL like "Doctor", "Nurse", and "Medicine".',
      quiz: {
        question: 'What is the sign for "Doctor"?',
        options: ['Touching the wrist with fingers', 'Pointing to the head', 'Crossing arms'],
        answer: 'Touching the wrist with fingers'
      }
    },
    // Add more lessons as needed
  ];

  const nextStep = () => {
    setStep((prevStep) => (prevStep + 1) % lessons.length);
    setSelectedAnswer('');
    setIsCorrect(null);
  };

  const prevStep = () => {
    setStep((prevStep) => (prevStep - 1 + lessons.length) % lessons.length);
    setSelectedAnswer('');
    setIsCorrect(null);
  };

  const handleAnswerSelection = (option) => {
    setSelectedAnswer(option);
    setIsCorrect(option === lessons[step].quiz.answer);
  };

  return (
    <div className="learning-module" style={{ padding: '20px', borderRadius: '8px', background: '#f7c0c8', color: '#fff' }}>
      <h2>{lessons[step].title}</h2>
      <p>{lessons[step].content}</p>

      <div>
        <h3>{lessons[step].quiz.question}</h3>
        {lessons[step].quiz.options.map((option) => (
          <button 
            key={option} 
            onClick={() => handleAnswerSelection(option)} 
            style={{
              display: 'block', 
              margin: '10px 0', 
              padding: '10px', 
              background: selectedAnswer === option ? '#007052' : '#fff', 
              color: selectedAnswer === option ? '#fff' : '#000', 
              borderRadius: '5px', 
              border: '1px solid #007052', 
              cursor: 'pointer'
            }}>
            {option}
          </button>
        ))}
        {isCorrect !== null && (
          <p>{isCorrect ? 'Correct!' : 'Incorrect. The correct answer is ' + lessons[step].quiz.answer + '.'}</p>
        )}
      </div>

      <div>
        <button onClick={prevStep} style={{ padding: '10px 20px', borderRadius: '5px', background: '#007052', color: '#fff', border: 'none', cursor: 'pointer', marginRight: '10px' }}>Previous</button>
        <button onClick={nextStep} style={{ padding: '10px 20px', borderRadius: '5px', background: '#007052', color: '#fff', border: 'none', cursor: 'pointer' }}>Next</button>
      </div>
    </div>
  );
}

export default LearningModule;