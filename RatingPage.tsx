import { droidsTable } from './MainPage'
import { mapRatingIcon, mapRatingStyle, howRatingChanged } from './utils'

app.screen('/', async (ctx, req) => {
  const droids = (await droidsTable.findAll(ctx)).sort((a, b) => b.currRating - a.currRating)

  return (
    <screen title="Рейтинг дроидов">
      <box style={{ position: 'relative' }}>
        <text
          style={{
            color: '#000029',
            fontSize: 'xl',
            fontWeight: '700',
            textAlign: 'center',
            textTransform: 'uppercase',
            marginVertical: 20,
          }}
        >
          Топ дроидов
        </text>
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
        }}
      >
        <box
          style={{
            paddingHorizontal: 5,
            paddingVertical: 10,
            borderBottom: [ 1, '#b3b3b3' ],
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <text style={{ flexBasis: '10%',  fontWeight: '600', paddingLeft: 10 }}>#</text>
          <text style={{ flexBasis: '35%', fontWeight: '600' }}>Имя дроида</text>
          <text style={{ flexBasis: '25%', fontWeight: '600' }}>Рейтинг</text>
          <text style={{ flexBasis: '30%', fontWeight: '600', paddingRight: 10 }}>Добавлен</text>
        </box>
        {
          droids.map((droid, index) => {
            const changeRating = howRatingChanged(droid.currRating, droid.prevRating)
            return (
              <box
                style={{
                  elevation: 5,
                  shadowColor: 'rgba(34, 60, 80, 0.3)',
                  backgroundColor: 'white',
                  paddingHorizontal: 5,
                  paddingVertical: 10,
                  borderBottom: index === (droids.length -1) ? [ 0, '#b3b3b3' ] : [ 1, '#b3b3b3' ],
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <text style={{ flexBasis: '10%', paddingLeft: 10 }}>{index+1}</text>
                <text style={{ flexBasis: '35%' }}>{droid.name}</text>
                <box style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    flexBasis: '25%',
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
                    name={['fas', mapRatingIcon[changeRating]]}
                    style={{
                      color: mapRatingStyle[changeRating]
                    }}
                  />
                </box>
                <text style={{ flexBasis: '30%', paddingRight: 10 }}>{droid.creationDate}</text>
              </box>
            )
          })
        }
      </box>

      <button
        class='dark'
        style={{
          backgroundColor: '#000',
          marginHorizontal: 10,
          marginVertical: 30,
          color: '#FFE81F',
        }}
        onClick={ctx.account.navigate('/MainPage')}
      >
        Выбрать своего дроида
      </button>

    </screen>
  )
})
