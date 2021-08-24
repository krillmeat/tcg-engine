// import { expect } from '@jest/globals';
// import Card from '../CLASSES/Card';

// describe('Card',()=>{
//   test('Render Card should return HTML Node',()=>{
//     let mockCard = new Card('ST1-01');

//     expect(typeof mockCard.renderCard()).toBe('object')
//   });

//   describe('Get Card Set ', ()=>{ 
//     let mockCard = new Card();
//     test('Should return String', () => {
//       expect(typeof mockCard.getCardSet('ST1-01')).toBe('string');
//     });

//     test('Should return piece before - in the Card Number',()=>{
//       expect(mockCard.getCardSet('ST1-01')).toBe('ST1');
//     });

//     test('Should return XX1 if incorrect String is sent in',()=>{
//       expect(mockCard.getCardSet('WRonG StR!nG')).toBe('XX1');
//     });
//   })
  
// });