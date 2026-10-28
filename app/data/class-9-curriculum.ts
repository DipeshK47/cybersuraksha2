import type {GradeSubject} from './curriculum';
import {class9Chapters} from './class9';

export const class9Subjects:GradeSubject[]=[
  {slug:'cybersecurity',name:'Cybersecurity',description:'Test access, connections, data use and recovery plans for a community learning desk.'},
  {slug:'artificial-intelligence',name:'Artificial Intelligence',description:'Explore data, model errors, pixels and language through measured classroom investigations.'},
  {slug:'computational-thinking-lab',name:'Computational Thinking',description:'Trace variables, test conditions and records, and compare practical algorithms and route costs.'},
  {slug:'cyber-fraud',name:'Cyber Fraud',description:'Check claims, payment directions and recurring permissions, and prepare useful evidence for help.'},
].map(subject=>({...subject,strand:subject.name as GradeSubject['strand'],book:'CyberShiksha Signal Studio · Class 9',chapters:[],
  modules:class9Chapters.filter(chapter=>chapter.strand===subject.name).map(chapter=>({title:chapter.title.en,strand:chapter.strand})),
}));
