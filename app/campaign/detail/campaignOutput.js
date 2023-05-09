'use-client';
import React, { useEffect, useState } from 'react'


export default function CampaignOutput({content}){
  
   
    return (

        <article className='w-full overflow-auto  p-4 bg-slate-900  backdrop-blur-lg' >
    
          <div className="prose max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: content.html }}>
    
          </div>
        </article>
    
    
      );

}