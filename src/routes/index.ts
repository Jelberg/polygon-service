import poligonrRouter  from './polygon/polygonRouter'


function routerApi(app){
    app.use('/api', poligonrRouter)
}

export default routerApi

