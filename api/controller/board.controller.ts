import express, { Application, Request, Response, NextFunction } from 'express';
import Boards from '../model/board.model';

const createBoard = async function (req: Request, res: Response, next: NextFunction) {
  try {
    console.log('working controller');
    const b = new Boards({
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

export { createBoard };
