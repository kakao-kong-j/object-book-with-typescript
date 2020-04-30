import {
  AmountDiscountPolicy,
  Movie,
  Money,
  SequenceCondition,
  PeriodCodition,
  PercentDiscountPolicy,
  Screening,
} from "../src/chapter2";
test("This is a sample", () => {
  const avatar = new Movie(
    "avatar",
    120,
    Money.wons(10000),
    new AmountDiscountPolicy(
      Money.wons(800),
      new SequenceCondition(1),
      new SequenceCondition(10),
      new PeriodCodition(1, new Date(), new Date()),
      new PeriodCodition(1, new Date(), new Date())
    )
  );
  console.log(avatar.calculateMovieFee(new Screening(avatar, 1, new Date())));

  const titanic = new Movie(
    "titanic",
    180,
    Money.wons(11000),
    new PercentDiscountPolicy(
      0.1,
      new PeriodCodition(2, new Date(), new Date()),
      new SequenceCondition(2),
      new PeriodCodition(4, new Date(), new Date())
    )
  );
  console.log(titanic.calculateMovieFee(new Screening(titanic, 2, new Date())));
  expect(true).toBe(true);
});
