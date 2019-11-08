import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfiguredUsersService } from './configured-users.service';
import { ConfiguredUser } from '../shared/configured-users.model';
import { MatTable } from '@angular/material/table';
import { ErrorDialog } from '../shared/error-dialog/error-dialog';
import { MatDialog } from '@angular/material';
import { UtilityService } from 'src/app/shared/utility.service';

export interface UserData {
  lineNo: number;
  email: string;
  isAdmin: boolean;
  oldIsAdminValue: boolean;
  serverId: string;
}

@Component({
  selector: 'app-configured-users',
  templateUrl: './configured-users.component.html',
  styleUrls: ['./configured-users.component.css']
})
export class ConfiguredUsersComponent implements OnInit {
  alert: string;
  alertClass: string = "";
  showSpinner = false;
  displayedColumns: string[] = ['lineNo', 'email', 'isAdmin', 'delete'];
  dataSource;
  dataSourceBackup;
  users: ConfiguredUser[];
  userData: UserData[] = [];
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;

  constructor(private cUService: ConfiguredUsersService, public dialog: MatDialog, private utilityService: UtilityService) { }

  ngOnInit() {
    this.refreshUsers();
  }


  refreshUsers() {
    this.showSpinner = true;

    this.cUService.getUsers().subscribe(usersFetched => {


      this.users = usersFetched;
      this.showSpinner = false;

      let index = 1;
      this.userData = [];
      this.users.forEach(user => {
        this.userData.push(
          { lineNo: index, email: user.email, isAdmin: user.isAdmin, oldIsAdminValue: user.isAdmin, serverId: user.serverId });
        index++;
      });
      this.dataSource = this.userData;
      //to clone the object, we use JSON.parse
      this.dataSourceBackup = JSON.parse(JSON.stringify(this.dataSource));
    },
      error => {
        this.showSpinner = false;
        this.dialog.open(ErrorDialog, {
          data: {
            message: "Error while fetching Users from server: "
              + this.utilityService.getError(error)
          }, panelClass: 'custom-modalbox'

        });
      });
  }

  onSaveChanges() {
    this.dataSource.forEach(element => {
      if (element.isAdmin != element.oldIsAdminValue) {
        this.showSpinner = true;
        console.log("Updating " + element.email + " to " + element.isAdmin);
        this.cUService.updateAdmin(element.serverId, element.isAdmin).subscribe(() => {
          this.alert = "Successfully saved changes";
          this.alertClass = "alert-success";
          setTimeout(() => {
            this.alert = " ";
            this.alertClass = "";
          }, 2000
          );
          this.showSpinner = false;
          this.refreshUsers();
        },
          error => {
            this.showSpinner = false;
            this.dialog.open(ErrorDialog, {
              data: {
                message: "Error while fetching saving changes: " +
                  this.utilityService.getError(error)
              }, panelClass: 'custom-modalbox'

            });
            return;
          });
      }
    });
  }

  onClearChanges() {
    this.dataSource = JSON.parse(JSON.stringify(this.dataSourceBackup));
    this.table.renderRows();
  }

  onDeleteClicked(email: string, serverId: string) {
    this.showSpinner = true;
    this.cUService.removeUser(serverId).subscribe(() => {
      this.alert = "Deleted User " + email;
      this.alertClass = "alert-success";
      setTimeout(() => {
        this.alert = " ";
        this.alertClass = "";
      }, 2000
      );
      this.showSpinner = false;
      this.refreshUsers();
    },
      error => {

        this.showSpinner = false;
        this.dialog.open(ErrorDialog, {
          data: {
            message: "Error while deleting user: " +
              this.utilityService.getError(error)
          }, panelClass: 'custom-modalbox'

        });
        return;
      });
  }
}
