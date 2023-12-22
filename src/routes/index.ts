import poligonrRouter  from './polygon/polygon.router'


function routerApi(app){
    app.use('/api', poligonrRouter)
}

export default routerApi

