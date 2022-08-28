import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  elements = [
    { name: 'Home', link: '' },
    { name: 'Transactions', link: 'transactions' },
    { name: 'About', link: 'about' },
  ];

  constructor() {}

  ngOnInit(): void {}
}
