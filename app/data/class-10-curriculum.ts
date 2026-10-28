import type {GradeSubject} from './curriculum';
import {class10Chapters} from './class10';

export const class10Subjects:GradeSubject[]=[
  {slug:'cybersecurity',name:'Cybersecurity',description:'Trace access, requests and recovery before publishing shared work.'},
  {slug:'artificial-intelligence',name:'Artificial Intelligence',description:'Compare models, trace image and text processing, and explain evaluation evidence.'},
  {slug:'computational-thinking-lab',name:'Computational Thinking',description:'Trace state, data and algorithms; test constraints and alternative plans.'},
  {slug:'cyber-fraud',name:'Cyber Fraud',description:'Check sources, payment claims and coercive requests using independent evidence.'},
].map(subject=>({...subject,strand:subject.name as GradeSubject['strand'],book:'CyberShiksha Decision Lab · Class 10',chapters:[],
  modules:class10Chapters.filter(chapter=>chapter.strand===subject.name).map(chapter=>({title:chapter.title.en,strand:chapter.strand})),
}));
