import {LogService} from './log.service';
import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

@Injectable()
export class StarWarsService {

  private character = [
    { name: 'Luke Skywalker', side: ''},
    { name: 'Darth Vader', side: ''}
  ];
  private logService: LogService;
  charactersChanged = new Subject<void>();
  http: Http;

  constructor(logService: LogService, http: Http) {
    this.logService = logService;
    this.http = http;
  }

  fetchCharacters() {
    this.http.get('https://swapi.co/api/people/')
    .map(
      (response: Response) => {
        const data = response.json();
        const extractedChars = data.results;
        const chars = extractedChars.map((char) => {
          return {name: char.name, side: ''};
        });
        return chars;
      }
    )
    .subscribe(
      (data) => {
        console.log(data);
        this.character = data;
        this.charactersChanged.next();
      }
    );
  }

  getCharacters(chosenList) {
    if (chosenList === 'all') {
      return this.character.slice();
    }
    return this.character.filter((char) => {
      return char.side === chosenList;
    });
  }

  onSideChosen(charInfo) {
    const pos = this.character.findIndex((char) => {
      return char.name === charInfo.name;
    });
    this.character[pos].side = charInfo.side;
    this.charactersChanged.next();
    this.logService.writeLog('Changed side of ' + charInfo.name + ' , new side: ' + charInfo.side);
  }

  addCharacter(name, side) {
    const pos = this.character.findIndex((char) => {
      return char.name === name;
    });
    if (pos !== -1) {
      return;
    }
    const newChar = {name: name, side: side};
    this.character.push(newChar);
  }
}
