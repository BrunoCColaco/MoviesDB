import { Component } from '@angular/core';
import { MOVIES } from '../movies';
import { Movie } from '../movie';
import { MovieService } from './movie.service';


@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.css'
})
export class MoviesComponent {
  movies: Movie[];
  

  constructor(private movieService: MovieService) { }

  ngOnInit(){
    this.getMovies();
  }
  getMovies(): void{
    this.movieService.getMovies().subscribe(movies => this.movies = movies);
  }
  add(name: string, url: string): void {
    name = name.trim();
    url = url.trim();
    console.log(url);
    if (!name || !url) { return; }

    this.movieService.addMovie({ name, url } as unknown  as Movie).subscribe(movie => {console.log(movie);this.movies.push(movie);});
  }

  delete(movie: Movie): void {
    this.movies = this.movies.filter(m => m !== movie);
    this.movieService.deleteMovie(movie).subscribe();
  }
}
