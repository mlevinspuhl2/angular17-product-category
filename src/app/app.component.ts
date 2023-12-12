import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProductAddEditComponent } from './product-add-edit/product-add-edit.component';
import { ProductService } from './product.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import products from "../assets/product.json";
import Swal from 'sweetalert2'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'description',
    'price',
    'color',
    'category',
    'action'
  ];

  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private productService: ProductService,
    public responsive: BreakpointObserver
  ) { }

  ngOnInit(): void {

    this.responsive
      .observe([Breakpoints.HandsetPortrait])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          console.log(
            'This is the Handset Portrait point at max-width: 599.98 px and portrait orientation.'
          );
        }
      });
    //setTimeout(() => {
    //  this.dataSource.paginator = this.paginator
    //  this.dataSource.sort = this.sort
    //}
    //);
    this.getProductList();
  }

  openAddEditProductDialog() {
    const dialogRef = this.dialog.open(ProductAddEditComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getProductList();
        }
      },
    });
  }

  //getProductList() {
  //  var res = products;
  //  this.dataSource = new MatTableDataSource(res);
  //      this.dataSource.sort = this.sort;
  //      this.dataSource.paginator = this.paginator;
  //  //  },
  //  //  error: (err) => {
  //  //    console.log(err);
  //  //  },
  //  //});
  //}

  getProductList() {
    //this.productService.getProductList().subscribe({
    //  next: (res) => {
    //    this.dataSource = new MatTableDataSource(res);
    //    this.dataSource.sort = this.sort;
    //    this.dataSource.paginator = this.paginator;
    //  },
    //  error: console.log,
    //});
    this.productService.getAll().then(({ data }) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }).catch(error => { return error })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  //deleteProduct(id: number) {
  //  let confirm = window.confirm("Do you want to delete this product?");
  //  if (confirm) {
  //    this.productService.deleteProduct(id).subscribe({
  //      next: (res) => {
  //        alert('Product deleted!');
  //        this.getProductList();
  //      },
  //      error: (err) => {
  //        console.log(err);
  //      },
  //    });
  //  }
  //}
  handleDelete(id: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
      if (result.isConfirmed) {
        this.productService.delete(id)
          .then(response => {
            Swal.fire({
              icon: 'success',
              title: 'Product deleted successfully!',
              showConfirmButton: false,
              timer: 1500
            })
            this.getProductList()
            return response
          }).catch(error => {
            Swal.fire({
              icon: 'error',
              title: 'An Error Occured!',
              showConfirmButton: false,
              timer: 1500
            })
            return error
          })
      }
    })
  }

  openEditForm(data: any) {
    const dialogRef = this.dialog.open(ProductAddEditComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getProductList();
        }
      }
    });
  }
}
