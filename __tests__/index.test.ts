import {
  AmountDiscountPolicy,
  Movie,
  Money,
  SequenceCondition,
  PeriodCondition,
  PercentDiscountPolicy,
  Screening,
  NoneDiscountPolicy,
} from "../src/chapter2";
describe("This is a sample", () => {
  it("금액 할인만 받고 기간 할인에는 일치 하지 않을 때", () => {
    //GIVEN
    const avatar = new Movie(
      "avatar",
      120,
      Money.wons(10000),
      new AmountDiscountPolicy(
        Money.wons(800),
        new SequenceCondition(1),
        new SequenceCondition(10),
        new PeriodCondition(
          1,
          new Date(2000, 1, 1, 0, 0, 0),
          new Date(2000, 1, 3, 0, 0, 0)
        )
      )
    );
    const now = new Date(2000, 1, 2, 0, 0, 0);
    const sequence = 1;
    //WHEN
    const fee = avatar.calculateMovieFee(new Screening(avatar, sequence, now));
    //THEN
    expect(fee.amount).toEqual(9200);
  });
  it("퍼센트 할인의 기간이 맞았을", () => {
    //GIVEN
    const titanic = new Movie(
      "titanic",
      180,
      Money.wons(10000),
      new PercentDiscountPolicy(
        0.1,
        new PeriodCondition(
          3,
          new Date(2000, 1, 1, 0, 0, 0),
          new Date(2000, 1, 3, 0, 0, 0)
        ),
        new SequenceCondition(2)
      )
    );
    const now = new Date(2000, 1, 2, 0, 0, 0);
    const sequence = 1;
    //WHEN
    const fee = titanic.calculateMovieFee(
      new Screening(titanic, sequence, now)
    );
    //THEN
    expect(fee.amount).toEqual(9000);
  });
  it("할인 정책이 없을 수 있습니다.", () => {
    //GIVEN
    const titanic = new Movie(
      "titanic",
      180,
      Money.wons(10000),
      new NoneDiscountPolicy()
    );
    const now = new Date(2000, 1, 2, 0, 0, 0);
    const sequence = 1;
    //WHEN
    const fee = titanic.calculateMovieFee(
      new Screening(titanic, sequence, now)
    );
    //THEN
    expect(fee.amount).toEqual(10000);
  });
  it("할인 정책을 변경할 수 있습니다..", () => {
    //GIVEN
    const titanic = new Movie(
      "titanic",
      180,
      Money.wons(10000),
      new NoneDiscountPolicy()
    );
    const now = new Date(2000, 1, 2, 0, 0, 0);
    const sequence = 1;
    //WHEN
    titanic.changeDiscountPolicy(
      new PercentDiscountPolicy(
        0.1,
        new PeriodCondition(
          3,
          new Date(2000, 1, 1, 0, 0, 0),
          new Date(2000, 1, 3, 0, 0, 0)
        ),
        new SequenceCondition(2)
      )
    );
    const fee = titanic.calculateMovieFee(
      new Screening(titanic, sequence, now)
    );
    //THEN
    expect(fee.amount).toEqual(10000);
  });
});
