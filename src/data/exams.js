export const exams = [
 { id:'cds', name:'CDS', full:'Combined Defence Services', branch:'IMA · INA · AFA · OTA', color:'olive', subjects:['English','General Knowledge','Elementary Mathematics'], tests:12, description:'Prepare for the written examination with subject-wise practice and full-length mock tests.' },
 { id:'afcat', name:'AFCAT', full:'Air Force Common Admission Test', branch:'Flying · Ground Duty', color:'blue', subjects:['General Awareness','Verbal Ability','Numerical Ability','Reasoning & Military Aptitude'], tests:10, description:'Build speed, accuracy and confidence across all AFCAT sections.' },
 { id:'nda', name:'NDA', full:'National Defence Academy', branch:'Army · Navy · Air Force', color:'sand', subjects:['Mathematics','General Ability Test'], tests:14, description:'Strengthen fundamentals and practise the Mathematics and GAT papers.' }
];
export const sampleQuestions = [
 {id:1,subject:'General Knowledge',topic:'Indian Polity',q:'Which part of the Constitution of India deals with Fundamental Rights?',options:['Part II','Part III','Part IV','Part V'],answer:1,explanation:'Part III (Articles 12–35) of the Constitution deals with Fundamental Rights.'},
 {id:2,subject:'English',topic:'Vocabulary',q:'Choose the word closest in meaning to “Abundant”.',options:['Scarce','Plentiful','Fragile','Brief'],answer:1,explanation:'Abundant means existing in large quantities; plentiful is the closest synonym.'},
 {id:3,subject:'Elementary Mathematics',topic:'Percentages',q:'A number is increased by 20% and then decreased by 20%. What is the net change?',options:['No change','4% decrease','4% increase','2% decrease'],answer:1,explanation:'Take 100 as the starting value: 100 × 1.2 × 0.8 = 96, a 4% decrease.'},
 {id:4,subject:'General Awareness',topic:'Geography',q:'Which is the longest river that flows entirely within India?',options:['Ganga','Godavari','Krishna','Narmada'],answer:1,explanation:'The Godavari is the longest river flowing entirely within India.'},
 {id:5,subject:'Reasoning',topic:'Series',q:'Find the next number: 3, 8, 15, 24, 35, __',options:['44','46','48','50'],answer:2,explanation:'The differences are 5, 7, 9, 11; the next difference is 13, giving 48.'}
];
