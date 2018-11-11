import { Component, OnInit, ViewChild } from "@angular/core";
import { data } from "./data";

import { IgxDialogComponent, IgxGridComponent, Transaction } from "igniteui-angular";

@Component({
	selector: 'app-$(filePrefix)',
	styleUrls: ['./$(filePrefix).component.scss'],
	templateUrl: './$(filePrefix).component.html'
})
export class $(ClassName)Component implements OnInit {
	@ViewChild("gridRowEditTransaction", { read: IgxGridComponent }) public gridRowEditTransaction: IgxGridComponent;
	@ViewChild(IgxDialogComponent) public dialog: IgxDialogComponent;
	@ViewChild("dialogGrid", { read: IgxGridComponent }) public dialogGrid: IgxGridComponent;

	public currentActiveGrid: { id: string, transactions: any[] } = { id: "", transactions: [] };

	public data: any[];
	public transactionsData: Transaction[] = [];
	private addProductId: number;
	
  constructor() {
	this.data = data;
	this.addProductId = this.data.length + 1;
   }

   public ngOnInit(): void {
	this.transactionsData = this.gridRowEditTransaction.transactions.getAggregatedChanges(true);
	this.gridRowEditTransaction.transactions.onStateUpdate.subscribe(() => {
		this.transactionsData = this.gridRowEditTransaction.transactions.getAggregatedChanges(true);
	});
}

   public addRow(gridID) {
		this.gridRowEditTransaction.addRow({
			CategoryID: this.getRandomInt(1, 10),
			Discontinued: this.getRandomInt(1, 10) % 2 === 0,
			OrderDate: new Date(this.getRandomInt(2000, 2050), this.getRandomInt(0, 11), this.getRandomInt(1, 25))
			.toISOString().slice(0, 10),
			ProductID: this.addProductId++,
			ProductName: "Product with index " + this.getRandomInt(0, 20),
			QuantityPerUnit: (this.getRandomInt(1, 10) * 10).toString() + " pcs.",
			ReorderLevel: this.getRandomInt(10, 20),
			SupplierID: this.getRandomInt(1, 20),
			UnitPrice: this.getRandomInt(10, 1000),
			UnitsInStock: this.getRandomInt(1, 100),
			UnitsOnOrder: this.getRandomInt(1, 20)
		});
	}

	public deleteRow(event, gridID, rowID) {
		this.gridRowEditTransaction.deleteRow(rowID);
	}

	public undo(gridID) {
		this.gridRowEditTransaction.transactions.undo();
	}

	public redo(gridID) {
		this.gridRowEditTransaction.transactions.redo();
	}

	public openCommitDialog() {
        this.dialog.open();
        this.dialogGrid.reflow();
    }

	public commit() {
		this.gridRowEditTransaction.transactions.commit(this.data);
		this.dialog.close();
	}

	public cancel() {
		this.dialog.close();
	}

	public discard() {
        this.gridRowEditTransaction.transactions.clear();
        this.dialog.close();
	}
	
	public stateFormatter(value: string) {
        return JSON.stringify(value);
	}
	
	public typeFormatter(value: string) {
        return value.toUpperCase();
    }

	private getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	private classFromType(type: string): string {
        return `transaction--${type.toLowerCase()}`;
	}
	
	public get undoEnabled(): boolean {
        return this.gridRowEditTransaction.transactions.canUndo;
	}
	
	public get redoEnabled(): boolean {
        return this.gridRowEditTransaction.transactions.canRedo;
	}
	
	public get hasTransactions(): boolean {
        return this.gridRowEditTransaction.transactions.getAggregatedChanges(false).length > 0;
    }
}
