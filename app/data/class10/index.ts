import {class10SecurityChapters} from './security';
import {class10AiChapters} from './ai';
import {class10CtChapters} from './ct';
import {class10FraudChapters} from './fraud';

export const class10Chapters=[...class10SecurityChapters,...class10AiChapters,...class10CtChapters,...class10FraudChapters];
export const getClass10Chapter=(slug:string)=>class10Chapters.find(chapter=>chapter.slug===slug);
