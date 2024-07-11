import { Heap } from '@app/heap'
import { refresh } from '@app/ui'
import { 
  getRandomIndexes, calcEloRating, howRatingChanged, mapRatingStyle, mapRatingIcon,
  } from './utils'
import {  typeFieldName, typeMapFieldName  } from './models'

const fieldNames: typeFieldName[] = ['model', 'class', 'affiliation']

const mapFieldName: typeMapFieldName = {
  model: 'Модель',
  class: 'Класс',
  affiliation: 'Принадлежность',
}

export const droidsTable = Heap.Table('pictures', {
  name: Heap.String(),
  image: Heap.ImageFile(),
  class: Heap.Optional( Heap.String()),
  model: Heap.Optional( Heap.String() ),
  affiliation: Heap.Optional( Heap.String() ),
  currRating: Heap.NonRequired( Heap.Number(), 1200 ),
  prevRating: Heap.NonRequired( Heap.Number(), 1200),
  creationDate: Heap.String(),
})

app.apiCall('showDroid', async function (ctx, req) {
  const { winnerId, loserId } = req.body.value
  
  const droids = await droidsTable.findAll(ctx)
  const winnerCard = droids.find(droid => droid.id === winnerId)
  const loserCard = droids.find(droid => droid.id === loserId)

  if (winnerCard && loserCard) {
    const { 
        newWinRating,
        newLosRating,
      }  = calcEloRating(winnerCard.currRating, loserCard.currRating)

    winnerCard.prevRating = winnerCard.currRating
    winnerCard.currRating = newWinRating
    loserCard.prevRating = loserCard.currRating
    loserCard.currRating = newLosRating

    await droidsTable.update(ctx, {
      id: winnerCard.id,
      currRating: winnerCard.currRating,
      prevRating: winnerCard.prevRating,
    })
    await droidsTable.update(ctx, {
      id: loserCard.id,
      currRating: loserCard.currRating,
      prevRating: loserCard.prevRating,
    })
  }

  return refresh()
})

app.screen('/', async (ctx, req) => {
  const droids =  await droidsTable.findAll(ctx)
  const { firstIndex, secondIndex } = getRandomIndexes(droids.length)
  const twoRandomDroid = [droids[firstIndex], droids[secondIndex]]

  return (
    <screen title="Сравнение дроидов"  style={{ backgroundColor: '#f5f5f5' }}>
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
              Выбери своего дроида
            </text>
            <button
              style={{
                padding:0,
                height: 25,
                width: 25,
                position: 'absolute',
                right: 10,
                top: 20,
                backgroundColor: '#000'
              }}
              onClick={ctx.account.navigate('/NewDroid')}
            >
              <icon
                size={15}
                name={ ['fas', 'plus'] }
                style={{ color: '#FFE81F' }}

              />
            </button>
        </box>

        <box>
          {twoRandomDroid.map((droid) => {
            const changeRating = howRatingChanged(droid.currRating, droid.prevRating)
            const winnerId = droid.id
            const loserId = twoRandomDroid.find((card)=> card.id !== droid.id)?.id || null;
    
            return (
              <box
                id={droid.id}
                style={{
                  elevation: 5,
                  shadowColor: 'rgba(34, 60, 80, 0.3)',
                  backgroundColor: 'white',
                  marginHorizontal: 10,
                  marginBottom: 20,
                  border: [ 1, 'solid', '#b3b3b3' ],
                  borderRadius: 10
                }}
                onClick={ctx.router.apiCall('/showDroid', {value: {winnerId, loserId }})}
              > 
                <box>
                    <image
                      resizeMode='contain'
                      src={{
                        url: droid.image?.getThumbnailUrl(500, 300),
                      }}
                      style={{
                        width: '100%'
                      }}
                    />
                </box>
                <box class='section'>
                  <box
                    class='section'
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                  >
                    <text
                      style={{
                        color: '#000029',
                        fontSize: 'lg',
                        fontWeight: '700',
                      }}
                    >{droid.name}</text>
                    <box style={{ flexDirection: 'row' }}
                    >
                      <text 
                        style={{
                          color: '#000029',
                          fontWeight: '600',
                          textAlignVertical: 'center',
                          marginRight: 5,
                        }}
                      >
                        РЕЙТИНГ: 
                      </text>
                      <box style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}
                      >
                        <text
                          style={{
                            color: mapRatingStyle[changeRating],
                            textAlignVertical: 'center',
                            marginRight: 5,
                          }}
                        >
                          {droid.currRating}
                        </text>
                        <icon
                        size={15}
                        name={ ['fas', mapRatingIcon[changeRating]] }
                        style={{ color: mapRatingStyle[changeRating] }}
                        />
                      </box>
                    </box>
                  </box>
                  {
                    fieldNames.map((attr, index) => (
                      <box
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginTop: 2,
                        }}
                        key={attr}
                      >
                        <text style={{ color: '#000', fontWeight: '600' }}>
                          {mapFieldName[attr]}:
                        </text>
                        <text style={{ width: '50%', color: '#000029', textAlign: 'right', }}>
                          {droid[attr]}
                        </text>
                      </box>
                    ))
                  }
                </box>
              </box>
            )}
          )}
        </box>

        <box style={{width: '100%', marginTop: 10, marginBottom: 30, flexDirection: 'row', justifyContent: 'center' }}>
          <button
            class='dark'
            style={{
              width: 250,
              backgroundColor: '#000',
              color: '#FFE81F',
              textTransform: "uppercase",
              fontSize: 'sm',
            }}
            onClick={ctx.account.navigate('/RatingPage')}
          >
            Посмотреть рейтинг
          </button>
        </box>

      </box>
    </screen>
  )
})
