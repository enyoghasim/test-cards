import Card from '../model/card.model';
import Boards from '../model/board.model';

const createCard = async function (req: any, res: any, next: any) {
  try {
    console.log('working controller card');
    const b = new Card({
      id: '122343',
      title: 'test',
    });

    await b.save();
    console.log(req, res);
    res.json('hello');
    next();
  } catch (e) {
    console.log(e);
  }
  return;
};

export { createCard };
