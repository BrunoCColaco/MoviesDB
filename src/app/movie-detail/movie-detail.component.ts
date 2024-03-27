import { Component, Input } from '@angular/core';
import { Movie } from '../movie';
import { MovieService } from '../movies/movie.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrl: './movie-detail.component.css'
})
export class MovieDetailComponent {
  movie: Movie;

  constructor(public sanitizer: DomSanitizer, private route: ActivatedRoute, private movieService: MovieService, private location: Location) { }


  ngOnInit() {
    this.getMovie();
    console.log(this.movie.id);
  }

  getMovie(): void {

    const id = +this.route.snapshot.paramMap.get('id');
    this.movieService.getMovie(id)
      .subscribe(movie => this.movie = movie);
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    this.movieService.updateMovie(this.movie).subscribe(() => this.goBack());
  }
}
