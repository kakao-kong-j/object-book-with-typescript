export class Screening {
  private movie: Movie;
  private readonly sequence: number;
  private readonly whenScreened: Date;

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

export class Money {
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
  public times(percent: number): Money {
    return new Money(this.amount * percent);
  }
  public isLessThan(other: Money): boolean {
    return this.amount - other.amount < 0;
  }
  public isGreaterThan(other: Money): boolean {
    return this.amount - other.amount > 0;
  }
}
export class Customer {}

export class Reservation {
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

export class Movie {
  private title: string;
  private runningTime: number;
  private discountPolicy: DiscountPolicy;
  private readonly fee: Money;

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
    if (!this.discountPolicy) {
      return this.getFee();
    }
    return this.fee.minus(
      this.discountPolicy.calculateDiscountAmount(screening)
    );
  }
  public changeDiscountPolicy(discountPolicy: DiscountPolicy) {
    this.discountPolicy = discountPolicy;
  }
}

interface DiscountPolicy {
  calculateDiscountAmount(screen: Screening): Money;
}

abstract class DefaultDiscountPolicy implements DiscountPolicy {
  private readonly conditions: DiscountCondition[] = [];
  protected constructor(...conditions: DiscountCondition[]) {
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
interface DiscountCondition {
  isSatisfiedBy(screening: Screening): boolean;
}

export class SequenceCondition implements DiscountCondition {
  private readonly sequence: number;
  constructor(sequence: number) {
    this.sequence = sequence;
  }
  public isSatisfiedBy(screening: Screening): boolean {
    return screening.isSequence(this.sequence);
  }
}

export class PeriodCondition implements DiscountCondition {
  private readonly dayOfWeek: number;
  private readonly startTime: Date;
  private readonly endTime: Date;

  constructor(dayOfWeek: number, startTime: Date, endTime: Date) {
    this.dayOfWeek = dayOfWeek;
    this.startTime = startTime;
    this.endTime = endTime;
  }
  isSatisfiedBy(screening: Screening): boolean {
    return (
      screening.getStartTime().getDay() === this.dayOfWeek &&
      this.startTime <= screening.getStartTime() &&
      this.endTime >= screening.getStartTime()
    );
  }
}

export class AmountDiscountPolicy extends DefaultDiscountPolicy {
  private readonly discountAmount: Money;
  constructor(discountAmount: Money, ...conditions: DiscountCondition[]) {
    super(...conditions);
    this.discountAmount = discountAmount;
  }

  getDiscountAmount(screening: Screening): Money {
    return this.discountAmount;
  }
}

export class PercentDiscountPolicy extends DefaultDiscountPolicy {
  private readonly percent: number;
  constructor(percent: number, ...conditions: DiscountCondition[]) {
    super(...conditions);
    this.percent = percent;
  }
  getDiscountAmount(screening: Screening): Money {
    return screening.getMovieFee().times(this.percent);
  }
}

export class NoneDiscountPolicy implements DiscountPolicy {
  calculateDiscountAmount(screen: Screening): Money {
    return Money.ZERO;
  }
}
