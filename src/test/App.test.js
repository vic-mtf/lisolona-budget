import React from 'react';
import WritingArea from './writing-area/WritingArea';

export default function AppTest() {
 
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        alignItems: 'end'
      }}
    >
      <div>
        <WritingArea/>
      </div>
    </div>
  )
}


