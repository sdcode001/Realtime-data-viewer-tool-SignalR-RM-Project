import { Injectable, NgZone, OnDestroy, signal } from "@angular/core";
import * as signalR from '@microsoft/signalr'
import { number } from "echarts";
import { BehaviorSubject, Subscription } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class TagValueService implements OnDestroy {
    subscription: Subscription = new Subscription();
    //public connection: signalR.HubConnection;
    public hubConnection: BehaviorSubject<any> = new BehaviorSubject<boolean>(
        false
    );
    
    // this this the map between TagID and list of values for that TagID
    public TagValueMap: Map<any, any[]> = new Map();
    public TagValueTimeMap: Map<any, any[]> = new Map();
    
    constructor(private ngZone: NgZone){
       this.connect();
    }

    connect(){
            const connection = new signalR.HubConnectionBuilder()
              .configureLogging(signalR.LogLevel.Debug)
              .withUrl('http://localhost:5050/notify')
              .withAutomaticReconnect()
              .build();
      
            connection
              .start()
              .then(function () {
                console.log("####Connection started####");
              })
              .catch(function (err) {
                return console.error(err.toString());
              });
          


          connection.onclose(disconnected => {
            console.log("####Connection closed####");
            console.log(disconnected);
          });


          connection.on('Status', (data) => {
            this.ngZone.run(() => {
              this.hubConnection.next(true);
            });
            connection.invoke('AlarmGroup').catch((err) => {
              console.log(err);
            });
            this.subscription.add(
                
            );
          });


          try {
            connection.on('TagValue', (resultList: any) => {
              resultList.forEach((value: any) => {
                 if(!this.TagValueMap.has(value.assetDetailId)){
                    this.TagValueMap.set(value.assetDetailId, []);
                    this.TagValueTimeMap.set(value.assetDetailId, []);
                 }
                 const existingValues = this.TagValueMap.get(value.assetDetailId) || [];
                 const existingValuesTimes = this.TagValueTimeMap.get(value.assetDetailId) || [];
                 this.TagValueMap.set(value.assetDetailId, [...existingValues, value.valueDouble])
                 this.TagValueTimeMap.set(value.assetDetailId, [...existingValuesTimes, new Date().toLocaleTimeString([], { hour12: false })])
              })
            });

          } catch (error) {
            console.log(error);
          }          

    }


    disconnect(connection: signalR.HubConnection) {
        this.ngZone.run(() => {
          this.hubConnection.next(false);
        });
        connection.stop();
        this.subscription.unsubscribe();
    }


    ngOnDestroy(): void {
        this.TagValueMap = new Map();
        this.subscription.unsubscribe();
    }

}