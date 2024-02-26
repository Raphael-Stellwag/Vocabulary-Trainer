import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-button-back',
  templateUrl: './button-back.component.html',
  styleUrls: ['./button-back.component.css']
})
export class ButtonBackComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  backButtonPressed() {
    this.router.navigate(["../"]);
  }

}
