
class Index{
    static async index(ctx) {
        let res = {}
        
        await ctx.render('views/html/page1', {
            title: 'page1首页'
        })
    }
};

export default Index