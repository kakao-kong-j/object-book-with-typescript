class Screening {
  private movie: Movie;
  private sequence: number;
  private whenScreened: Date;

  constructor(movie: Movie, sequence: number, whenScreened: Date) {
    this.movie = movie;
    this.sequence = sequence;
    this.whenScreened = whenScreened;
  }

  public getStartTime(): Date {
    return this.whenScreened;
  }
  public isSequence(sequence: number): boolean {
    return this.sequence === sequence;
  }
  public getMovieFee(): Money {
    return this.movie.getFee();
  }

  private calculateFee(audienceCount: number): Money {
    return this.movie.calculateMovieFee(this).times(audienceCount);
  }

  public reserve(customer: Customer, audienceCount: number): Reservation {
    return new Reservation(
      customer,
      this,
      this.calculateFee(audienceCount),
      audienceCount
    );
  }
}

class Money {
  public static ZERO = Money.wons(0);
  public amount: number;

  public static wons(amount: number) {
    return new Money(amount);
  }
  constructor(amount: number) {
    this.amount = amount;
  }

  public plus(amount: Money): Money {
    return new Money(this.amount + amount.amount);
  }
  public minus(amount: Money): Money {
    return new Money(this.amount - amount.amount);
  }
  public times(persent: number): Money {
    return new Money(this.amount * persent);
  }
  public isLessThan(other: Money): boolean {
    return this.amount - other.amount < 0;
  }
  public isGreaterThan(other: Money): boolean {
    return this.amount - other.amount > 0;
  }
}
class Customer {}

class Reservation {
  private customer: Customer;
  private screening: Screening;
  private fee: Money;
  private audienceCount: number;

  constructor(
    customer: Customer,
    screening: Screening,
    fee: Money,
    audienceCount: number
  ) {
    this.audienceCount = audienceCount;
    this.customer = customer;
    this.screening = screening;
    this.fee = fee;
  }
}

class Movie {
  private title: string;
  private runningTime: number;
  private fee: Money;
  private discountPolicy: DiscountPolicy;

  constructor(
    title: string,
    runningTime: number,
    fee: Money,
    discountPolicy: DiscountPolicy
  ) {
    this.title = title;
    this.runningTime = runningTime;
    this.fee = fee;
    this.discountPolicy = discountPolicy;
  }

  public getFee(): Money {
    return this.fee;
  }

  public calculateMovieFee(screening: Screening): Money {
    return this.fee.minus(
      this.discountPolicy.calculateDiscountAmount(screening)
    );
  }
}

abstract class DiscountPolicy {
  private conditions: DiscountCondition[] = [];
  constructor(...conditions: DiscountCondition[]) {
    this.conditions = conditions;
  }
  public calculateDiscountAmount(screening: Screening): Money {
    for (const each of this.conditions) {
      if (each.isSatisfiedBy(screening)) {
        return this.getDiscountAmount(screening);
      }
    }
    return Money.ZERO;
  }
  abstract getDiscountAmount(screening: Screening): Money;
}
class DiscountCondition {
  public isSatisfiedBy(screening: Screening): boolean {
    return true;
  }
}
