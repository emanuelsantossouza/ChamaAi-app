import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  userId: string;

  constructor(private route: ActivatedRoute) {
    this.userId = this.route.snapshot.paramMap.get('userId') ?? 'default';
  }

  ngOnInit() {

  }
}
