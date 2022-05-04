using System;
namespace Test
{
    class Program
    {
        static int GCD(int x,int y)=>y?x:GCD(y,x%y);
        static void Main(string[] args)
        {
            int x=Convert.ToInt32(Console.ReadLine());
            int y=Convert.ToInt32(Console.ReadLine());
            Console.WriteLine(GCD(x,y));
        }
    }
}