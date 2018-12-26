#include <stdio.h>
#include <stdlib.h>

#define UNDER_18  0
#define OVER_18   1
#define RACE0 0
#define RACE1 1
#define RACE2 2



#define POSSIBLE_AGES 1024
#define POSSIBLE_RACES 59049

#define AGE(i,person) ((i & 1<<person) ? OVER_18 : UNDER_18)
#define RACE(i,person) (

// Person goes from 0..9

int main(int argc,char **argv)
{
    int ages[10];
    int races[10];
    int count = 0;

    /* Try all possible combinations of ages and races */
    memset(ages,0,sizeof(ages));
    memset(races,0,sizeof(races));

    

    for(int i=0; i < (1<<19); i++){
        
    }

}
