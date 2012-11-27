
// Constructor
function DebtLabBasic() {

    /**
     * Default amount to add when add to lender account command is invoked
	 */
	this.DEFAULT_ADD_TO_LENDER_ACCOUNT_AMOUNT = 1000;
	/**
	 * Starting value for money supply
	 */
	this.DEFAULT_STARTING_MONEY_SUPPLY = 10000;
    /**
     * Starting value for target money supply
	 */
    this.DEFAULT_BEGINNING_TARGET_MONEY_SUPPLY = 10000;

	/**
	 * If true then lender account is added to as necessary 
	 */
	this.DEFAULT_AUTO_ADD_TO_LENDER_ACCOUNT = false;
	/**
	 * if true target money supply is maintained by creating public money with no
	 * interest load
	 */
	this.DEFAULT_AUTO_CREATE_PUBLIC_MONEY = false;
	/**
	 * if true then money is lent from money on deposit as required
	 */
    this.DEFAULT_AUTO_LEND_FROM_LENDER_DEPOSITS = false;
	/**
	 * if true auto lender spend starts off as on
	 */
	this.DEFAULT_AUTO_LENDER_SPEND = false;
	/**
	 * If true target money supply grows at current rate
	 */
	this.DEFAULT_AUTO_TARGET_MONEY_SUPPLY_GROW = true;
	/**
	 * If true then lender is taxed on interest at the current rate when loans are
	 * paid back. Tax money goes back to money supply.
	 */
	this.DEFAULT_AUTO_TAX_LENDER = false;
	/**
	 * Amount lender account starts off with
	 */
	this.DEFAULT_BEGINNING_LENDER_BALANCE = 10000;
	/**
	 * Beginning amount in money on deposit. It is maintained at 50% of money supply
	 * during operation.
	 */
	this.DEFAULT_BEGINNING_LENDER_DEPOSIT_BALANCE = 5000;
	/**
	 * amount of public money to create on command
	 */
	this.DEFAULT_CREATE_PUBLIC_MONEY_AMOUNT = 1000;
	/**
	 * Default starting days per minute for speed of simulator.
	 */
	this.DEFAULT_YEARS_PER_MINUTE = 2;
	/**
	 * If true default on payback starts off as true.
	 */
	this.DEFAULT_DEFAULT_ON_PAY_BACK = false;
	/**
	 * Default lender spend rate of interest earned
	 */
	this.DEFAULT_LENDER_SPEND_RATE = 0.05;
	/**
	 * Default rate to tax lender on interest payments.
	 */
    this.DEFAULT_LENDER_TAX_RATE = 0.05;
	/**
	 * Default principal for newly created notes.
	 */
	this.DEFAULT_NOTE_AMOUNT = 100;
	/**
	 * Default interest rate for newly created notes.
	 */
	this.DEFAULT_NOTE_INTEREST_RATE = 0.05;
	/**
	 * Default term in days for newly created notes.
	 */
    this.DEFAULT_NOTE_TERM_DAYS = 90;
	/**
	 * Default rate at which target money supply should grow
	 */
	this.DEFAULT_TARGET_MONEY_SUPPLY_GROWTH_RATE = 0.05;
    
    /**
     * Milliseconds in a day.
	 */
    this. DAY_MS = 60 * 60 * 1000 * 24;
    
    
        /**
	 * Feature 17: While activated erases loans erases loans that come due without
	 * paying back to lender account or debit from money supply.
	 */
	this.defaultOnPayBackFlag = false;
	/**
	 * if true lender account is automatically added to as necessary
	 */
	this.autoAddToLenderAccountFlag;
	/**
	 * if true public money is created as needed
	 */
	this.autoCreatePublicMoneyFlag = false;
	/**
	 * return the current state of the auto spend flag
	 */
	this.autoLenderSpendFlag = false;
	/**
	 * if true loans are made from the deposits account
	 */
	this.autoLendFromLenderDepositsFlag;
	/**
	 * if true target money supply increases automatically default is true
	 */
	this.autoTargetMoneySupplyGrowFlag = true;
	/**
	 * if true lender interest is automatically taxed at the current rate
	 */
	this.autoTaxLenderFlag;
	/**
	 * Amount to add to money supply when creating public money
	 */
	this.createPublicMoneyAmount  = 1000;
	/**
	 * current money supply of economy
	 */
	this.currentMoneySupply = 10000;
	/**
	 * current day counter for tracking notes
	 */
	this.currentDayNumber = 0;
	/**
	 * rate of time passage as days per minute
	 */
    this.YearsPerMinute = 2;
	/**
	 * Amount to add to lender account when doAddToLenderAccount
	 */
	this.lenderAccountAddAmount = 1000;
	/**
	 * current lender account balance
	 */
	this.lenderAccountBalance  = 1000;
	/**
	 * Current amount on deposit Maintained as 50% of money supply 
	 */
	this.lenderDepositsBalance   = 5000;
	/**
	 * Percentage of last interest payment to move back to money supply when
	 * doLenderSpend is called
	 */
	this.lenderSpendRate = 0.05;
	/**
	 * percent of last interest payment to transfer to money supply when doTaxLender
	 * is called
	 */
	this.lenderTaxRate  = 0.05;
	/**
	 * Principal for newly created notes 
	 */
    this.noteAmount = 100;
	/**
	 * Interest rate for newly created notes
	 */
    this.noteInterestRate = 0.05;
	/**
	 * collection class of outstanding notes
	 */
	//   ****  TODO: this.NotesOutstanding notes = null;
	/**
	 * Term in days for newly created notes
	 */
	this.noteTermDays = 90;
	/**
	 * current goal for money supply level
	 */
	this.targetMoneySupply = 10000;
	/**
	 * rate at which target money supply grows every year
	 */
	this.targetMoneySupplyGrowthRate = 0.05;
    
    // Added fields
    
    this.currDate = new Date(2000, 0, 1);
    
    /**
     * Year counter
    */
   

}







DebtLabBasic.prototype.stepSimulation = function () {
    this.currDate = new Date(this.currDate.getTime() + this.DAY_MS);
    this.currentDayNumber += 1;
};


/**
 * Set all simulator values to defaults
 */
DebtLabBasic.prototype.doResetToDefaults = function () {
    
    this.defaultOnPayBackFlag = this.DEFAULT_DEFAULT_ON_PAY_BACK;
    this.autoAddToLenderAccountFlag = this.DEFAULT_AUTO_ADD_TO_LENDER_ACCOUNT;
	 
	this.autoCreatePublicMoneyFlag = this.DEFAULT_AUTO_CREATE_PUBLIC_MONEY;
 
	this.autoLenderSpendFlag = this.DEFAULT_AUTO_LENDER_SPEND;
	
	this.autoLendFromLenderDepositsFlag = this.DEFAULT_AUTO_LEND_FROM_LENDER_DEPOSITS;

	this.autoTargetMoneySupplyGrowFlag = this.DEFAULT_AUTO_TARGET_MONEY_SUPPLY_GROW;
	
	this.autoTaxLenderFlag = this.DEFAULT_AUTO_TAX_LENDER;

	this.createPublicMoneyAmount  = this.DEFAULT_CREATE_PUBLIC_MONEY_AMOUNT;

	this.currentMoneySupply =  this.DEFAULT_STARTING_MONEY_SUPPLY;
	
    this.daysPerMinute = this.DEFAULT_DAYS_PER_MINUTE;

	this.lenderAccountAddAmount = this.DEFAULT_ADD_TO_LENDER_ACCOUNT_AMOUNT;

	this.lenderAccountBalance  = this.DEFAULT_BEGINNING_LENDER_BALANCE;
	
	this.lenderDepositsBalance  = this.DEFAULT_BEGINNING_LENDER_DEPOSIT_BALANCE;
	
	this.lenderSpendRate = this.DEFAULT_LENDER_SPEND_RATE;
	
	this.lenderTaxRate  = this.DEFAULT_LENDER_TAX_RATE;
	
    this.noteAmount = this.DEFAULT_NOTE_AMOUNT;
	
    this.noteInterestRate = this.DEFAULT_NOTE_INTEREST_RATE;

	//   ****  TODO: this.NotesOutstanding notes = null;

	this.noteTermDays = this.DEFAULT_NOTE_TERM_DAYS;

	this.targetMoneySupply = this.DEFAULT_BEGINNING_TARGET_MONEY_SUPPLY;
    
	
	this.targetMoneySupplyGrowthRate = this.DEFAULT_TARGET_MONEY_SUPPLY_GROWTH_RATE;
 
};

DebtLabBasic.prototype.initClock = function (date) {
    this.currentDayNumber = 0;
    this.currDate = date;
};

DebtLabBasic.prototype.getDate = function() {
    return this.currDate;
};

DebtLabBasic.prototype.getDayNumber = function() {
    return this.currentDayNumber;
};

DebtLabBasic.prototype.getYearsPerMinute = function() {
    return this.YearsPerMinute;
};

DebtLabBasic.prototype.setYearsPerMinute = function(value) {
    if(value < 20 && value > 0) {
        this.YearsPerMinute = value;
    } else {
        this.YearsPerMinute = 2;
    }
};
    



