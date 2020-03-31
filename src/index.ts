class Invitation {
  private when: Date;
}

class Ticket {
  private fee: number;
  public getFee(): number {
    return this.fee;
  }
}

class Bag {
  private amount: number;
  private invitation?: Invitation;
  private ticket?: Ticket;

  constructor(amount: number, invitation?: Invitation) {
    this.amount = amount;
    this.invitation = invitation;
  }

  public hold(ticket: Ticket): number {
    if (this.hasInvitation()) {
      this.setTicket(ticket);
      return 0;
    } else {
      this.setTicket(ticket);
      this.minusAmount(ticket.getFee());
      return ticket.getFee();
    }
  }

  private hasInvitation(): boolean {
    return !!this.invitation;
  }

  public hasTicket(): boolean {
    return !!this.ticket;
  }

  private setTicket(ticket: Ticket): Ticket {
    return (this.ticket = ticket);
  }

  private minusAmount(amount: number): void {
    this.amount -= amount;
  }

  public plusAmount(amount: number): void {
    this.amount += amount;
  }
}

class Audience {
  private bag: Bag;
  constructor(bag: Bag) {
    this.bag = bag;
  }
  public getBag(): Bag {
    return this.bag;
  }
  public buy(ticket: Ticket): number {
    return this.bag.hold(ticket);
  }
}

class TicketOffice {
  private amount: number;
  private tickets: Ticket[] = [];

  constructor(amount: number, ...tickets: Ticket[]) {
    this.amount = amount;
    this.tickets = [...this.tickets, ...tickets];
  }

  public getTicket(): Ticket {
    return this.tickets[0];
  }
  public minusAmount(amount: number): void {
    this.amount -= amount;
  }

  public plusAmount(amount: number): void {
    this.amount += amount;
  }
}

class TicketSeller {
  private ticketOffice: TicketOffice;

  constructor(ticketOffice: TicketOffice) {
    this.ticketOffice = ticketOffice;
  }

  public sellTo(audience: Audience): void {
    this.ticketOffice.plusAmount(audience.buy(this.ticketOffice.getTicket()));
  }
}

class Theater {
  private ticketSeller: TicketSeller;
  constructor(ticketSeller: TicketSeller) {
    this.ticketSeller = ticketSeller;
  }

  public enter(audience: Audience): void {
    this.ticketSeller.sellTo(audience);
  }
}
