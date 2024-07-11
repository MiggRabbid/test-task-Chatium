import { getThumbnailUrl } from '@app/storage'
import { attachMedia } from "@app/ui"
import { droidsTable } from './MainPage'
import { getCreationDate } from './utils'
import {  typeInputField, typeMapInputField  } from './models'

const inputField: typeInputField[]  = ['name', "model", "class", "affiliation"]

const mapInputField: typeMapInputField = {
  name: 'Имя дроида',
  class: 'Класс',
  model: 'модель',
  affiliation: 'Принадлежность'
}

app.apiCall('onImgUpload', async (ctx, req) => {
  return ctx.router.navigate('?hash=' + req.body.file.hash)
})

app.apiCall('addNewDroid', async (ctx, req) => {
  const newDroid = {creationDate: getCreationDate(), ...req.body}
  await droidsTable.create(ctx, newDroid)
  return ctx.account.navigate('/MainPage')
})

app.screen('/', async (ctx, req) => {
  const droids = (await droidsTable.findAll(ctx)).sort((a, b) => b.currRating - a.currRating)

  const handleAddImg = attachMedia({
    mediaType: "photo",
    submitUrl: ctx.router.url('onImgUpload'),
    menuTitle: 'Выберите изображение',
  })

  return (
    <screen title="Рейтинг дроидов" style={{ backgroundColor: '#f5f5f5' }}>
      <box style={{ minHeight: '100%', flexDirection: 'column', justifyContent: 'space-between' }}>

        <box style={{ position: 'relative', paddingVertical: 25}}>
            <text
              style={{
                color: '#000029',
                fontSize: 'lg',
                fontWeight: '700',
                textAlign: 'center',
                textTransform: 'uppercase',
              }}
            >
              Новый дроид
            </text>
            <button
              style={{
                padding:0,
                height: 25,
                width: 25,
                position: 'absolute',
                right: 10,
                top: 15,
                backgroundColor: '#000'
              }}
              onClick={ctx.account.navigate('/MainPage')}
            >
              <icon
                size={15}
                name={ ['fas', 'house-user'] }
                style={{ color: '#FFE81F' }}
              />
            </button>
        </box>

        <box
          style={{
              elevation: 10,
              shadowColor: 'rgba(34, 60, 80, 0.3)',
              backgroundColor: 'white',
              border: [ 1, 'solid', '#b3b3b3' ],
              borderRadius: 10,
              marginVertical: 0,
              marginHorizontal: 10,
              paddingBottom: 20,
          }}
        >
          <box>
            {
              req.query?.hash && 
              <img 
                resizeMode='cover'
                src={getThumbnailUrl(req.query.hash)} 
                style={{ 
                  height: 350, 
                  width: '100%',
                }}
              />
            }
            {
              !req.query.hash && 
              <box 
                style={{ 
                  height: 350, 
                  width: '100%', 
                  backgroundColor: '#b3b3b3',
                  marginBottom: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                }} 
                onClick={handleAddImg}>
                  <icon
                    size='xl'
                    name={ ['fas', 'plus'] }
                    style={{ color: '#fff'}}

                  />
              </box>
            }
          </box>
          {
            inputField.map((field) => {
              return (
                <box style={{ marginTop: 10, marginHorizontal: 10 }}>
                  <text>{`${mapInputField[field]}:`}</text>
                    <text-input
                      name={`${field}`}
                      formId="newDroidForm"
                    />
                </box>
              )
            })
          }
        </box>

        <box style={{width: '100%', marginVertical: 30, flexDirection: 'row', justifyContent: 'center' }}>
          <button
            class='dark'
            style={{
              width: 250,
              backgroundColor: '#000',
              color: '#FFE81F',
              textTransform: "uppercase",
              fontSize: 'sm',
            }}
            onClick={{
              type: 'submitForm',
              formId: 'newDroidForm',
              url: ctx.router.url('/addNewDroid'),
              params: {image: req.query?.hash},
            }}
          >
            Добавить в рейтинг
          </button>
        </box>

      </box>
    </screen>
  )
})
