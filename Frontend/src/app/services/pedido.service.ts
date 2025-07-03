import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PedidoService {
    private apiUrl = 'http://localhost:3000/orders';

    constructor(private http: HttpClient) {}

    // Método DELETE
    deletePedido(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }

    // Método GET (nuevo)
    getPedidos(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl);
    }
}
