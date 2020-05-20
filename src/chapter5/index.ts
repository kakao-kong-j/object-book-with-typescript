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
  private title: string;
  private runningTime: number;
  private fee: Money;
  private discountConditions: DiscountCondition[];

  private movieType: MovieType;
  private discountAmount: Money;
  private discountPercent: number;

  public calculateMovieFee(screening: Screening): Money {}
}

class Customer {}

class Reservation {}

class Money {}

class DiscountCondition {}

enum MovieType {
  AMOUNT_DISCOUNT,
  PERCENT_DISCOUNT,
  NONE_DISCOUNT,
}
