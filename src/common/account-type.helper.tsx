import { AccountTypeLowerOptions, AccountTypeUpperOptions } from "auth/enum/account-type-upper-options";
import { formater } from "./common-helper";

export const getValue = (val: string) => {
    let fVal = formater(val);
    switch (fVal) {
        case AccountTypeLowerOptions.FSA: fVal = AccountTypeUpperOptions.FSA; break;
        case AccountTypeLowerOptions.PPF: fVal = AccountTypeUpperOptions.PPF; break;
        case AccountTypeLowerOptions.CD: fVal = AccountTypeUpperOptions.CD; break;
    }
    if (fVal.includes(` ${AccountTypeLowerOptions.ISA}`)) {
        fVal = fVal.replace(` ${AccountTypeLowerOptions.ISA}`, ` ${AccountTypeUpperOptions.ISA}`);
    }
    if (fVal.includes(` ${AccountTypeLowerOptions.IRA}`)) {
        fVal = fVal.replace(` ${AccountTypeLowerOptions.IRA}`, ` ${AccountTypeUpperOptions.IRA}`);
    }

    return fVal;
}