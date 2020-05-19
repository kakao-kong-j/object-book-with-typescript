export class Screening {
  private movie: Movie;
  private sequence: number;
  private whenScreened: Date;

  public reserve(customer: Customer, audienceCount: number) {
    return new Reservation(
      customer,
      this,
      this.calculateFee(audienceCount),
      audienceCount
    );
  }

  private calculateFee(audienceCount: number): Money {
    return this.movie.calculateMovieFee(this).times(audienceCount);
  }
}

class Movie {
  public calculateMovieFee(screening: Screening): Money {}
}

class Customer {}

class Reservation {}

class Money {}
