import {Component, OnInit} from '@angular/core'
import {RoleService} from "./services/backendcalls/roleservice";
import {LocalStorageService} from "./services/localstorageservice";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  readonly CLASS_TAG = 'AppComponent'
  title = '2MuchWaste';

  constructor(
    private roleService: RoleService,
    private lStorageService: LocalStorageService,
  ) {
  }

  ngOnInit(): void {
    this.roleService.setRoles()
  }

}
