import { Injectable } from '@angular/core';
import { MOVIES } from '../movies';
import { Movie } from '../movie';
import { Observable, of } from 'rxjs';
import { MessageService } from '../messages/message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private moviesUrl = 'api/movies'; // URL to web api
  httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

  constructor(private messageService: MessageService, private http: HttpClient) { }

  getMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(this.moviesUrl).pipe(
      tap(_ => this.log('fetched Movies')), catchError(this.handleError<Movie[]>('getMovies', [])));
  }

  getMovie(id: number): Observable<Movie> {
    const url = `${this.moviesUrl}/${id}`;

    return this.http.get<Movie>(url)
      .pipe(tap(_ => this.log(`fetched movie id=${id}`)), catchError(this.handleError<Movie>(`getMovie id=${id}`)));
  }

  private log(message: String) {
    this.messageService.add(`MovieService: ${message}`);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);

      this.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    };
  }

  updateMovie(movie: Movie): Observable<any> {
    return this.http.put(this.moviesUrl, movie, this.httpOptions).pipe(
      tap(_ => this.log(`updated movie id=${movie.id}`)),
      catchError(this.handleError<any>('updateMovie'))
    );
  }

  addMovie(movie: Movie): Observable<Movie> {
    return this.http.post<Movie>(this.moviesUrl, movie, this.httpOptions)
      .pipe(
        tap((newMovie: Movie) => this.log(`added movie w/ id=${newMovie.id} url=${newMovie.url}`)),
        catchError(this.handleError<Movie>('addMovie')));
  }

  deleteMovie(movie: Movie | number): Observable<Movie> {
    const id = typeof movie === 'number' ? movie : movie.id;
    const url = `${this.moviesUrl}/${id}`;

    return this.http.delete<Movie>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted movie id=${id}`)), catchError(this.handleError<Movie>('deleteMovie')));
  }

  searchMovies(term: string): Observable<Movie[]> {
    
    if (!term.trim()) {
      // if not search term, return empty movie array.
      return of([]);
    }
  
    return this.http.get<Movie[]>(`${this.moviesUrl}/?name=${term}`)
      .pipe(
        tap(_ => this.log(`found movies matching "${term}"`)),
        catchError(this.handleError<Movie[]>('searchMovies',
          []))
      );
  }
}
