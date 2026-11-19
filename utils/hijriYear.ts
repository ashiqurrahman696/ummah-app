const getHijriYear = (year: number) => {
    if(year >= 2064){
        return year - 577;
    }
    else if(year >= 2031){
        return year - 578;
    }
    else if(year >= 1998){
        return year - 579;
    }
    else if(year >= 1966){
        return year - 580;
    }
    else if(year >= 1938) {
        return year - 581;
    }
}

export {getHijriYear};