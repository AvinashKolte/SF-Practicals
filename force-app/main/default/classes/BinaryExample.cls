public with sharing class BinaryExample {
    
    public static Integer calculateZerosBetweenOnes(Integer n)
    {
        Integer quotient;
        String binary='';
        Integer num;
        if(n!=null && n>0)
        {
            quotient=n;
            while(quotient>0)
            {
                binary+=Math.mod(quotient, 2);
                quotient=quotient/2;
                
            }
            if(binary!=null && binary.length()>0){
                System.debug('binary :'+binary.reverse());
                binary=binary.reverse();
                String between=binary.substringBetween('1', '1');
                System.debug('between:'+between);
                if(between!=null && between.length()>0)
                {
                    num=between.length();
                    System.debug('number of zeros:'+num);
                }
            }
            
        }
        return num;
    }
}