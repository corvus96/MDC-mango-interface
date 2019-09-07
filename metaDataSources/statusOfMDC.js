function status(totalPower){
    if(totalPower<=0){
        return 1;
    }
    else if(totalPower>16 || totalPower<5){
        return 2;
    }
    else if(totalPower>14 || totalPower<7){
        return 3;
    }
    else if(totalPower<=14 || totalPower>=7){
        return 4;
    }
}

return state = status(totalPower.value);