




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
	 * If true then money is borrowed as necessary
	 */
    this.DEFAULT_AUTO_BORROW = false;
    
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
	this.DEFAULT_CREATE_PUBLIC_MONEY_AMOUNT = 100;
	/**
	 * Default starting days per minute for speed of simulator.
	 */
	this.DEFAULT_YEARS_PER_MINUTE = 6;
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
     * Default multiplier for simulation day increment
	 */
	this.DEFAULT_SPEED_MULTIPLIER = 1;
    
    /**
     * Number of steps to count before
     * processing auto flags
     */
	this.DEFAULT_AUTO_COUNT_INTERVAL = 30;
    
    
    /**
     * Milliseconds in a day.
	 */
    this. DAY_MS = 60 * 60 * 1000 * 24;
    
    /**
     * Length of trending data
     */
     this.TREND_ARRAY_LENGTH = 12;
    
    
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
     * if true money is automatically borrowed as needed
	 */
	this.autoBorrowFlag = false;
    
    
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
	this.createPublicMoneyAmount  = 100;
    
    
    this.publicMoneyCreated = 0;
    
    
	/**
	 * current money supply of economy
	 */
	this.currentMoneySupply = 10000;
    
    /**
     * keep track of last money supply change
	 */
    this.lastMoneySupply = 10000;
    this.lastMoneySupplyDayNumber = 0;
    
    
    
	/**
	 * current day counter for tracking notes
	 */
	this.currentDayNumber = 0;
	/**
	 * rate of time passage as days per minute
	 */
    this.yearsPerMinute = 6;
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
    
    /**
     * Default multiplier for simulation day increment
     */
	this.multiplier = 1; 
    
    /**
     * Number of steps to count before
     * processing auto flags
     */
     this.autoCountInterval = 30;
    
    /**
     * Counter for interval for processing automatic parameters
     */
     this.autoCounter = 0;
    
    /**
     * Total interest paid to lenders
     */
     this.interestPaid = 0;
   
    /**
     * Interest trend
     */
     this.interestPaidTrend = 0.0;
     
     /**
      * Current amount owed to lender
      */
     this.debtToLender = 0;
      
     /**
      * Debt to Lender trend
      */
     this.debtToLenderTrend = 0.0;
      
     /**
      * Last interest amount for calculating 
      * Lender spending and taxes
      */
      this.lastInterestPayment = 0;
      
    
    // Added fields
    
    this.currDate = new Date(2000, 0, 1);
    
    /**
     * Year counter
    */
   

}







DebtLabBasic.prototype.stepSimulation = function () {
    if (this.yearsPerMinute > 9 ) {
        this.multiplier = 1; // this.multiplier = 10;
    } else {
        this.multiplier = 1;
    }
    this.currDate = new Date(this.currDate.getTime() + (this.DAY_MS * this.multiplier));
    this.currentDayNumber += this.multiplier;
    // this.currentMoneySupply += 1;
    this.autoCounter += this.multiplier;
    
    
    // Don't call handleAutoFlags every step to
    // avoid rounding problems on yearly percentage rates
    if ( this.autoCounter >= this.autoCountInterval) {
        this.handleAutoFlags();
        this.autoCounter = 0;
    }
    
 
    
    
};

/**
 * Payback note
 */
DebtLabBasic.prototype.paybackNote = function() {
    
    // TODO: Complete this feature
    this.lastInterestPayment = 100;
    
    
    // Handle lender auto tax
    if(this.autoTaxLenderFlag) {
        this.doTaxLender();
    }
    
    // Handle lender auto spend
    if(this.autoLenderSpendFlag) {
        this.doLenderSpend();
    }
    
    
}


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
    
    this.autoBorrowFlag = this.DEFAULT_AUTO_BORROW;



	this.createPublicMoneyAmount  = this.DEFAULT_CREATE_PUBLIC_MONEY_AMOUNT;

    this.publicMoneyCreated = 0;

	this.currentMoneySupply  =  this.DEFAULT_STARTING_MONEY_SUPPLY;
    this.lastMoneySupply =  this.DEFAULT_STARTING_MONEY_SUPPLY;
    this.lastMoneySupplyDayNumber = 0;
    this.moneySupplyTrend = 0.0;
   
	
    this.yearsPerMinute = this.DEFAULT_YEARS_PER_MINUTE;

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
    
    this.multiplier = this.DEFAULT_SPEED_MULTIPLIER;
    
    this.autoCountInterval = this.DEFAULT_AUTO_COUNT_INTERVAL;
     
    this.autoCounter = 0;
    
    this.interestPaid = 0;
    this.interestPaidTrend = 0.0;
    
    this.debtToLender = 0;
      
    this.debtToLenderTrend = 0.0;
    
    this.lastInterestPayment = 0;

 
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
   
    return this.yearsPerMinute;
};

DebtLabBasic.prototype.setYearsPerMinute = function(value) {
    console.log(value);
    if(value < 50 && value > 0) {
        this.yearsPerMinute = value;
    } else {
        this.yearsPerMinute = 2;
    }
};









DebtLabBasic.prototype.setAutoLendFromLenderDepositsFlag = function(value) {
    this.autoLendFromLenderDepositsFlag = value;
};

DebtLabBasic.prototype.getAutoLendFromLenderDepositsFlag = function() {
    return this.autoLendFromLenderDepositsFlag;
};

DebtLabBasic.prototype.multiplier= function(value) {
    this.multiplier = value;
};

DebtLabBasic.prototype.multiplier = function() {
    return this.multiplier;
};


// ******** Public Money *********

/**
 * Create public money adds non-debt money to
 * the money supply and keeps track of how much
 * has been created.
 */
DebtLabBasic.prototype.doCreatePublicMoney = function() {
    this.setMoneySupply(this.currentMoneySupply += this.createPublicMoneyAmount);
    this.publicMoneyCreated += this.createPublicMoneyAmount;
};

/**
 * Sets the simulator to automatically create public money on demand.
 * 
 * @param {boolean} value 
 */
DebtLabBasic.prototype.setAutoCreatePublicMoneyFlag = function(value) {
    this.autoCreatePublicMoneyFlag = value;
};

/**
 * Returns a boolean indicating if the simulator is automatically creating
 * public money on demand.
 * 
 * @returns {boolean} current value of auto create public money.
 */
DebtLabBasic.prototype.getAutoCreatePublicMoneyFlag = function() {
    return this.autoCreatePublicMoneyFlag;
};



/**
 * Sets the amount of public money to add to money supply.
 * 
 * @param {int} value 
 */
DebtLabBasic.prototype.setCreatePublicMoneyAmount = function(value) {
    this.createPublicMoneyAmount = value;
};

/**
 * Returns the current amount the simulator is using to add to money supply.
 * 
 * @returns {int} Current value of create public money amount.
 */
DebtLabBasic.prototype.getCreatePublicMoneyAmount = function() {
    return this.createPublicMoneyAmount;
};



// ******** Target Money Supply *********


/**
 * Sets the simulator to automatically increase the target money supply.
 * 
 * @param {boolean} value 
 */
DebtLabBasic.prototype.setAutoTargetMoneySupplyGrow = function(value) {
    this. autoTargetMoneySupplyGrowFlag = value;
};

/**
 * Returns a boolean indicating if the simulator is automatically
 * increasing the target money supply.
 * 
 * @returns {boolean} current value of auto increase target money supply.
 */
DebtLabBasic.prototype.getAutoTargetMoneySupplyGrow = function() {
    return this.autoTargetMoneySupplyGrowFlag;
};



/**
 * Target money supply is the value for money supply that the 
 * simulation tries to maintain. This sets the target money supply.
 * 
 * @param {int} value 
 */
DebtLabBasic.prototype.setTargetMoneySupply = function(value) {
    this.targetMoneySupply = value;
};

/**
 * Returns the current value of the target money supply.
 * 
 * @returns {int} Current value of the target money supply.
 */
DebtLabBasic.prototype.getTargetMoneySupply = function() {
    return this.targetMoneySupply;
};

/**
 * Growth rate for the target money supply.
 * 
 * @param {float} value 
 */
DebtLabBasic.prototype.setTargetMoneySupplyGrowthRate = function(value) {
    this.targetMoneySupplyGrowthRate = value;
};

/**
 * Returns the current value of the target money supply growth rate.
 * 
 * @returns {float} Current value of the target money growth rate.
 */
DebtLabBasic.prototype.getTargetMoneySupplyGrowthRate = function() {
    return this.targetMoneySupplyGrowthRate;
};

// ******** Money Supply *********

/**
 * Money supply is total money in the economy available for commerce. 
 * 
 * @param {int} value 
 */
DebtLabBasic.prototype.setMoneySupply = function(value) {
    
    // Dampen change rate calculation
    var days = this.currentDayNumber - this.lastMoneySupplyDayNumber;
    if(days > this.autoCountInterval) {
        var diff = value - this.lastMoneySupply;
        this.moneySupplyTrend = (diff/this.lastMoneySupply) * (365/days);
        this.lastMoneySupplyDayNumber = this.currentDayNumber;
        this.lastMoneySupply = value;
    }
    this.currentMoneySupply = value;
};

/**
 * Returns the current value of the money supply.
 * 
 * @returns {int} Current value of the money supply.
 */
DebtLabBasic.prototype.getMoneySupply = function() {
    return this.currentMoneySupply;
};

/**
 * Returns the trend for the current money supply as
 * a fraction per year plus or minus. This calculated 
 * periodically with the autoCountInterval.
 * 
 * @returns {float} money supply trend.
 */
DebtLabBasic.prototype.getMoneySupplyTrend = function() {
    return this.moneySupplyTrend;
}

// ******** Interest Paid *********

/**
 * Increment the interest paid and adjust yearly trend 
 * rate for interest
 * 
 * @param {int} value 
 */
DebtLabBasic.prototype.addInterestPaid = function(value) {
    
    // Dampen change rate calculation
    // var days = this.currentDayNumber - this.lastInterestDayNumber;
    // if(days > this.autoCountInterval) {
    //    var diff = value - this.lastIn;
    //    this.moneySupplyTrend = (diff/this.lastMoneySupply) * (365/days);
    //    this.lastMoneySupplyDayNumber = this.currentDayNumber;
    //    this.lastMoneySupply = value;
    // }
    this.interestPaid += value;
};

/**
 * Returns the total interest paid to lender.
 * 
 * @returns {int} total interest paid.
 */
DebtLabBasic.prototype.getInterestPaid = function() {
    return this.interestPaid;
};

/**
 * Returns the trend for the yearly interest 
 * payments
 * 
 * @returns {float} interest payments trend.
 */
DebtLabBasic.prototype.getInterestPaidTrend = function() {
    return this.interestPaidTrend;
}

// ******** Debt to Lender *********

/**
 * Set the current debt to lender and calculate trend
 * rate for debt
 * 
 * @param {int} value 
 */
DebtLabBasic.prototype.setDebtToLender = function(value) {
    
    // Dampen change rate calculation
    // var days = this.currentDayNumber - this.lastInterestDayNumber;
    // if(days > this.autoCountInterval) {
    //    var diff = value - this.lastIn;
    //    this.moneySupplyTrend = (diff/this.lastMoneySupply) * (365/days);
    //    this.lastMoneySupplyDayNumber = this.currentDayNumber;
    //    this.lastMoneySupply = value;
    // }
    this.debtToLender= value;
};

/**
 * Returns the current debt to lender
 * 
 * @returns {int} current debt to lender.
 */
DebtLabBasic.prototype.getDebtToLender = function() {
    return this.interestPaid;
};

/**
 * Returns the trend for the debt to lender 
 * 
 * @returns {float} debt to lender trend.
 */
DebtLabBasic.prototype.getDebtToLenderTrend = function() {
    return this.debtToLenderTrend;
}


// ******* Lender Payback ********

/**
 * Sets the simulator to default on notes as they become due.
 * 
 * 
 * @param {boolean} value 
 */
DebtLabBasic.prototype.setDefaultOnPaybackFlag = function(value) {
    this.defaultOnPayBackFlag = value;
};


/**
 * Returns a boolean indicating if the simulator is automatically
 * defaulting on notes as they become due
 * 
 * @returns {boolean} current value of auto borrow flag.
 */
DebtLabBasic.prototype.getDefaultOnPaybackFlag = function() {
    return this.defaultOnPayBackFlag;
};


// ***** Lender Spends ******

/**
 * Lender spends allows spending of lender interest back into the money supply.
 */
DebtLabBasic.prototype.doLenderSpend = function() {
    
    
    this.setLenderAccountBalance(this.lenderAccountBalance -= (this.lastInterestPayment * this.lenderSpendRate));
     
};


/**
 * Spend rate of last interest payment.
 * 
 * @param {float} value 
 */
DebtLabBasic.prototype.setLenderSpendRate = function(value) {
    this.lenderSpendRate = value;
};

/**
 * Returns the spend rate of last interest payment.
 * 
 * @returns {float} Current value of the spend rate of last interest payment.
 */
DebtLabBasic.prototype.getLenderSpendRate = function() {
    return this.lenderSpendRate;
};


/**
 * Sets the simulator to automatically spend a percentage
 * of interest payments.
 * 
 * 
 * @param {boolean} value 
 */
DebtLabBasic.prototype.setAutoLenderSpendFlag = function(value) {
    this.autoLenderSpendFlag = value;
};

/**
 * Returns a boolean indicating if the simulator is automatically
 * spending a percentage of interest payments
 * 
 * @returns {boolean} current value of auto borrow flag.
 */
DebtLabBasic.prototype.getAutoLenderSpendFlag = function() {
    return this.autoLenderSpendFlag;
};

// ***** Tax Lender ******

/**
 * Tax lender allows taxing of lender interest back into the money supply.
 */
DebtLabBasic.prototype.doTaxLender = function() {
    
    
    this.setLenderAccountBalance(this.lenderAccountBalance -= (this.lastInterestPayment * this.lenderTaxRate));
     
};


/**
 * Tax rate of last interest payment.
 * 
 * @param {float} value 
 */
DebtLabBasic.prototype.setTaxRate = function(value) {
    this.lenderTaxRate = value;
};

/**
 * Returns the tax rate of last interest payment.
 * 
 * @returns {float} Current value of the tax rate of last interest payment.
 */
DebtLabBasic.prototype.getTaxRate = function() {
    return this.lenderTaxRate;
};




/**
 * Sets the simulator to automatically tax a percentage
 * of interest payments.
 * 
 * 
 * @param {boolean} value 
 */
DebtLabBasic.prototype.setAutoTaxLenderFlag = function(value) {
    this.autoTaxLenderFlag = value;
};


/**
 * Returns a boolean indicating if the simulator is automatically
 * taxing a percentage of interest payments
 * 
 * @returns {boolean} current value of auto borrow flag.
 */
DebtLabBasic.prototype.getAutoTaxLenderFlag = function() {
    return this.autoTaxLenderFlag;
};



// ***** Add to Lender Account ******

/**
 * Add to lender account box allows adding
 * arbitrary or automatic money to lender's private account.
 */
DebtLabBasic.prototype.doAddToLenderAccount = function() {
    this.setLenderAccountBalance(this.lenderAccountBalance += this.lenderAccountAddAmount);
   
    
};


/**
 * Sets the amount to add to lender account.
 * 
 * @param {int} value 
 */
DebtLabBasic.prototype.setLenderAccountAddAmount = function(value) {
    this.lenderAccountAddAmount = value;
};

/**
 * Returns the amount to add to lender account.
 * 
 * @returns {int} the amount to add to lender account.
 */
DebtLabBasic.prototype.getLenderAccountAddAmount = function() {
    return this.lenderAccountAddAmount;
};



/**
 * Sets the simulator to automatically add to lender account
 * as needed.
 * 
 * @param {boolean} value 
 */
DebtLabBasic.prototype.setAutoAddToLenderAccountFlag = function(value) {
    this.autoAddToLenderAccountFlag = value;
};


/**
 * Returns a boolean indicating if the simulator is automatically
 * maintaining lender account.
 * 
 * @returns {boolean} current value of auto borrow flag.
 */
DebtLabBasic.prototype.getAutoAddToLenderAccountFlag = function() {
    return this.autoAddToLenderAccountFlag;
};





// ******** Borrow *********

/**Borrow money creates a note with the currently 
 * set parameters of amount and interest rate and 
 * adds the amount to the money supply. 
 */
DebtLabBasic.prototype.doBorrow = function() {
    this.paybackNote();
    // TODO: Implement the borrow operations
    // alert("Borrowing Money");
    
};

/**
 * Sets the simulator to automatically borrow from lender on demand.
 * 
 * @param {boolean} value 
 */
DebtLabBasic.prototype.setAutoBorrowFlag = function(value) {
    this.autoBorrowFlag = value;
};

/**
 * Returns a boolean indicating if the simulator is automatically borrowing
 * to maintain money supply.
 * 
 * @returns {boolean} current value of auto borrow flag.
 */
DebtLabBasic.prototype.getAutoBorrowFlag = function() {
    return this.autoBorrowFlag;
};


/**
 * Sets the current amount for new notes.
 * 
 * @param {String} value 
 */
DebtLabBasic.prototype.setNoteAmount = function(value) {
    this.noteAmount = value;
};

/**
 * Returns the current amount for new notes.
 * 
 * @returns {String} Current amount for new notes.
 */
DebtLabBasic.prototype.getNoteAmount = function() {
    return this.noteAmount;
};


/**
 * Interest rate for new notes.
 * 
 * @param {float} value 
 */
DebtLabBasic.prototype.setNoteInterestRate = function(value) {
    this.noteInterestRate = value;
};

/**
 * Returns the interest rate for new notes.
 * 
 * @returns {float} Current interest rate for new notes.
 */
DebtLabBasic.prototype.getNoteInterestRate = function() {
    return this.noteInterestRate;
};

// ***** Lender's Account ******

/**
 * Lender account shows the amount of money that the 
 * lender is holding out of economy.  
 * 
 * @param {int} value 
 */
DebtLabBasic.prototype.setLenderAccountBalance = function(value) {
    
    // Dampen change rate calculation
    // var days = this.currentDayNumber - this.lastMoneySupplyDayNumber;
    // if(days > this.autoCountInterval) {
    //    var diff = value - this.lastMoneySupply;
    //    this.moneySupplyTrend = (diff/this.lastMoneySupply) * (365/days);
    //    this.lastMoneySupplyDayNumber = this.currentDayNumber;
    //    this.lastMoneySupply = value;
    // }
    this.lenderAccountBalance = value;
};

/**
 * Returns the current balance of the lender's account.
 * 
 * @returns {int} Current balance of the lender's account.
 */
DebtLabBasic.prototype.getLenderAccountBalance = function() {
    return this.lenderAccountBalance;
};


/**
 * Checks all the automatic flags and applies the appropriate
 * operations to the state of the simulator. Called with each 
 * autoCountInterval steps through the simulation. This is done
 * to avoid truncation of small integer values calculated
 * on a daily basis.
 */
DebtLabBasic.prototype.handleAutoFlags = function() {
    
    // Calculate the number of virtual days that have passed
    var vDays = (this.multiplier * 365)/this.autoCountInterval;
    
    // Auto Public Money
    if( this.autoCreatePublicMoneyFlag && (this.currentMoneySupply < this.targetMoneySupply)) {
        this.doCreatePublicMoney();
    }
    
    // Auto Target Money Supply
    if( this.autoTargetMoneySupplyGrowFlag) {
        this.targetMoneySupply += ((this.targetMoneySupply * this.targetMoneySupplyGrowthRate) / vDays);
        
    }
    
    // Keep enough money in lender account to make a loan
    if ( this.autoAddToLenderAccountFlag) {
        if( this.lenderAccountBalance < this.noteAmount) {
            this.doAddToLenderAccount();
        }
    }
    
    
    

};


DebtLabBasic.prototype.AverageArray = function(ar) {
    var sum = 0.0;
    for(var i = 0; i < ar.length; i++) {
        sum += ar[i];
    }
    return sum/ar.length;
}



